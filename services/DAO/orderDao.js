const db = require("../db");
const moment = require("moment");

const orderDao = {};

orderDao.addOrder = async (orderData) => {
  let conn = null;

  try {
    conn = await db.createConnection();
    let orderObj = {
      idProduct: orderData.idProduct,
      idUser: orderData.idUser,
      quantity: orderData.quantity,
      orderDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    return await db.query("INSERT INTO orders SET ?", orderObj, "insert", conn);
  } catch (e) {
    console.log(e.message);
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

orderDao.addProductsOrders = async (rProdOrdData) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    let rProdOrdObj = {
      idProduct: rProdOrdData.idProduct,
      idOrder: rProdOrdData.idOrder,
    };

    return await db.query(
      "INSERT INTO rel_products_orders SET ?",
      rProdOrdObj,
      "insert",
      conn
    );
  } catch (e) {
    console.log(e.message);
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

orderDao.updateProductStock = async (idProduct, stock) => {
  let conn = null;

  try {
    conn = await db.createConnection();
    return await db.query(
      "UPDATE products SET stock = ? WHERE id = ?",
      [stock, idProduct],
      "update",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

orderDao.getProduct = async (idProduct) => {
  let conn = null;

  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM products where id= ?",
      idProduct,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};
module.exports = orderDao;
