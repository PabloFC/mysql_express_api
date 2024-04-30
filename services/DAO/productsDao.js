const { removeUndefinedKeys } = require("../../utils/removeUndefinedkeys");
const db = require("../db");
const moment = require("moment");

const productDao = {};

productDao.getProductByReference = async (reference) => {
  // Conectamos con la base de datos y buscamos si existe el producto por la referencia.
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM products WHERE reference = ?",
      reference,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productDao.addProduct = async (productData) => {
  // Conectamos con la base de datos y añadimos el producto.
  let conn = null;
  try {
    conn = await db.createConnection();
    // Creamos un objeto con los datos del producto a guardar en la base de datos.
    // Usamos la libreria momentjs para registrar la fecha actual.
    let productObj = {
      name: productData.name,
      description: productData.description,
      reference: productData.reference,
      stock: productData.stock,
      price: productData.price,
      registerDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    // Eliminamos los campos que no se van a registrar (no llegan por el body)
    productObj = await removeUndefinedKeys(productObj);
    // Insertamos el nuevo producto
    return await db.query(
      "INSERT INTO products SET ?",
      productObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productDao.addProductFile = async (fileData) => {
  // Conectamos con la base de datos y añadimos la información de la imagen.
  let conn = null;
  try {
    conn = await db.createConnection();
    // Creamos un objeto con los datos del archivo a guardar en la base de datos.
    // Usamos la libreria momentjs para registrar la fecha actual.
    let fileObj = {
      name: fileData.name,
      path: fileData.path,
      productId: fileData.productId,
      registerDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    // Insertamos el registro
    return await db.query("INSERT INTO images SET ?", fileObj, "insert", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = productDao;
