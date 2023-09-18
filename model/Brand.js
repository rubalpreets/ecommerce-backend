const mongoose = require("mongoose");

const { Schema } = mongoose;

// "value": "smartphones",
// "label": "smartphones",
// "checked": false

const brandSchema = new Schema({
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true, unique: true },
});

exports.Brand = mongoose.model("Brands", brandSchema);
