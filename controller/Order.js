const { Order } = require("../model/Order");

exports.fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  console.log(id);
  const query = Order.find({ user: id });
  try {
    const orders = await query.exec();
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    // const result = await doc.populate("items.product");
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

// TODO - No such API in gront End till now
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Order.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.UpdateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    // const result = await order.populate("product");
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  //filter = {"category" : ["smartphone", "laptops]"}
  //sort = {_sort:"price", _order:"desc"}
  //pagination = {_page:1, _limit=10}

  // TODO - Try with multiple categories
  // TODO - sort via discounted price not actual price

  let query = Order.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  let totalOrders;
  console.log("hello");
  try {
    const docQuery = query.clone();
    totalOrders = await docQuery.countDocuments();
  } catch (err) {
    res.status(400).json({ message: "from totaldocs" });
  }
  console.log(totalOrders);

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const doc = await query.exec();
    res.set("X-Total-Count", totalOrders);
    res.status(200).json(doc);
    //! setting header of x total count
  } catch (err) {
    res.status(400).json({ message: "from query", err });
  }
};
