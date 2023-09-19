const { User } = require("../model/User");

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

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json({ email: doc.email, id: doc.id });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  const user = User.findOne({ email: req.body.email });
  try {
    const doc = await user.exec();

    // TODO password encription using password js
    if (doc && doc.password === req.body.password) {
      res.status(201).json({ id: doc.id, email: doc.email, name: doc.name });
    } else {
      res.status(401).json({ message: "Wrong Credentials" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
