const express = require("express");
const {
  createOrder,
  fetchOrdersByUser,
  deleteOrder,
  UpdateOrder,
  fetchAllOrders,
} = require("../controller/Order");

const router = express.Router();

router
  .post("/", createOrder)
  .get("/own", fetchOrdersByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", UpdateOrder)
  .get("/", fetchAllOrders);

exports.router = router;
