const { Cart } = require("../model/Cart");
const { Order } = require("../model/Order");

exports.fetchOrdersByUser = async (req, res) => {
  const { user } = req.query;
  const query = Order.find({ user: user });
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
    const result = await order.populate("product");
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
