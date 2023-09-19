const express = require("express");
const { createUser, loginUser } = require("../controller/Auth");
const {
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  UpdateCart,
} = require("../controller/Cart");

const router = express.Router();

router
  .post("/", addToCart)
  .get("/", fetchCartByUser)
  .delete("/:id", deleteFromCart)
  .patch("/:id", UpdateCart);

exports.router = router;
