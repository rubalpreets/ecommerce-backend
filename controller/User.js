const { User } = require("../model/User");

exports.fetchUserByID = async (req, res) => {
  const { id } = req.params;
  const query = User.findById(id);
  try {
    const user = await query.exec();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};
