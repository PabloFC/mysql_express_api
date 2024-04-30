const express = require("express");
const { addOrder } = require("../controllers/orderController");
const orderRouter = express.Router();

orderRouter.post("/", addOrder);

module.exports = orderRouter;
