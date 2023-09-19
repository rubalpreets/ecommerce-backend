const { response } = require("express");
const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  //! req.body will get us data in schema of product we deined in model
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  //filter = {"category" : ["smartphone", "laptops]"}
  //sort = {_sort:"price", _order:"desc"}
  //pagination = {_page:1, _limit=10}

  // TODO - Try with multiple categories
  // TODO - sort via discounted price not actual price

  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  if (req.query.category) {
    query = query.find({ category: req.query.category });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  let totalDocs;
  console.log("hello");
  try {
    const docQuery = query.clone();
    totalDocs = await docQuery.countDocuments();
  } catch (err) {
    res.status(400).json({ message: "from totaldocs" });
  }
  console.log(totalDocs);

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const doc = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(doc);
    //! setting header of x total count
  } catch (err) {
    res.status(400).json({ message: "from query", err });
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};
