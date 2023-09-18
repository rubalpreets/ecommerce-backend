const mongoose = require("mongoose");

const { Schema } = mongoose;

// "value": "smartphones",
// "label": "smartphones",
// "checked": false

const categorySchema = new Schema({
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true, unique: true },
});

exports.Category = mongoose.model("Category", categorySchema);
