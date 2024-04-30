const productDao = require("../services/DAO/productsDao");
const path = require("path");

// controlador para añadir un producto e imágenes asociadas
const addProduct = async (req, res) => {
  // Verificamos que el body no esté vacío
  if (Object.keys(req.body).length === 0)
    return res.status(400).send("Error al recibir el body");
  try {
    // Buscamos el producto por la referencia
    const product = await productDao.getProductByReference(req.body.reference);
    if (product.length > 0)
      return res.status(409).send("El producto ya existe");
    // Anadimos el nuevo producto
    const productId = await productDao.addProduct(req.body);
    // Obtenemos las imagenes, las subimos al servidor y añadimos los datos de la
    // imagen y el producto asociado a la base de datos
    // Controlamos si nos viene algún tipo de archivo en el objeto files
    if (req.files || Object.keys(req.files).length > 0) {
      // 1 archivo [{}] , >1 archivo [[{},{},...]]
      // Obtenemos un array de objetos con todas las imágenes
      const images = !req.files.imagen.length
        ? [req.files.imagen]
        : req.files.imagen;
      // Recorremos el array para procesar cada imagen
      for (const image of images) {
        // Ya podemos acceder a las propiedades del objeto image.
        // Obtenemos la ruta de la imagen.
        let uploadPath = path.join(
          __dirname,
          "../public/product/" + image.name
        );
        // Usamos el método mv() para ubicar el archivo en nuestro servidor
        image.mv(uploadPath, (err) => {
          if (err) return res.status(500).send(err);
        });
        await productDao.addProductFile({
          name: image.name,
          path: uploadPath,
          productId,
        });
      }
      return res.send(`Producto ${req.body.name} con id ${productId} añadido`);
    }
  } catch (e) {
    console.log(e.message);
    throw new Error(e.message);
  }
};
module.exports = { addProduct };
