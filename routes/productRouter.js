const express = require("express");
const { addProduct } = require("../controllers/productController");
const productRouter = express.Router();
// Añadir producto
productRouter.post("/", addProduct);
module.exports = productRouter;
