const { Brand } = require("../model/Brand");

exports.fetchBrands = async (req, res) => {
  const query = Brand.find({});
  try {
    const brands = await query.exec();
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createBrand = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const doc = await brand.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
