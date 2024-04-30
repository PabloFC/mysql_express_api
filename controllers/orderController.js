const orderDao = require("../services/DAO/orderDao");
const { jwtVerify } = require("jose");

const addOrder = async (req, res) => {
  //Obtenemos el token de autorizacion
  const { authorization } = req.headers;
  if (!authorization) return res.sendStatus(401);
  const token = authorization.split(" ")[1];

  try {
    const enconder = new TextEncoder();
    const { payload } = await jwtVerify(
      token,
      enconder.encode(process.env.JWT_SECRET)
    );
    //construimos el objeto con los datos del pedido
    const orderData = {
      idProduct: req.body.idProduct,
      idUser: payload.id,
      quantity: req.body.quantity,
    };

    const idOrder = await orderDao.addOrder(orderData);
    if (!idOrder) return res.sendStatus(500).send("Error al insertar pedido");

    const rProdOrdId = await orderDao.addProductsOrders({
      idProduct: req.body.idProduct,
      idOrder,
    });

    if (!rProdOrdId)
      return res.sendStatus(500).send("Error al insertar rel_product_order");

    const getProduct = await orderDao.getProduct(req.body.idProduct);
    if (getProduct.length === 0)
      return res.status(404).send("no se encontro el producto");
    // [{name: 'product', price:100, stock:10}]

    const productStock = getProducts[0].stock;

    const newStock = productStock - req.body.quantity;
    const updateProductStock = await orderDao.updateProductStock(
      newStock,
      req.body.idProduct
    );

    if (!updateProductStock)
      return res.sendStatus(500).send("Error al actualizar stock");

    return res.status(201).send(`Pedido Añadido con id ${idOrder}`);
  } catch (e) {
    console.log(e.message);
    throw new Error(e);
  }
};

module.exports = { addOrder };
