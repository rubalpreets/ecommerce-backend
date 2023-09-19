const express = require("express");
const {
  createOrder,
  fetchOrdersByUser,
  deleteOrder,
  UpdateOrder,
} = require("../controller/Order");

const router = express.Router();

router
  .post("/", createOrder)
  .get("/", fetchOrdersByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", UpdateOrder);

exports.router = router;
