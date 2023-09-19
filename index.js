const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { createProduct } = require("./controller/Product");
const ProductsRouter = require("./routes/Products");
const BrandsRouter = require("./routes/Brands");
const CategoriesRouter = require("./routes/Categories");
const UsersRouter = require("./routes/Users");
const AuthRouter = require("./routes/Auth");
const CartRouter = require("./routes/Cart");
const OrdersRouter = require("./routes/Orders");

const server = express();

//! middlewares

server.use(
  cors({
    origin: ["http://localhost:3003"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(express.json()); // to parse req.body

server.use("/products", ProductsRouter.router);
server.use("/categories", CategoriesRouter.router);
server.use("/brands", BrandsRouter.router);
server.use("/users", UsersRouter.router);
server.use("/auth", AuthRouter.router);
server.use("/cart", CartRouter.router);
server.use("/orders", OrdersRouter.router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("mongo db connected");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.listen(8080, () => {
  console.log("server is running on port ", 8080);
});
