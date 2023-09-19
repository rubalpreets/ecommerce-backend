const express = require("express");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const structure = {
  items: [
    {
      title: "iPhone X",
      description:
        "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...",
      price: 899,
      discountPercentage: 17.94,
      rating: 4.44,
      stock: 34,
      brand: "Apple",
      category: "smartphones",
      thumbnail: "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
      images: [
        "https://i.dummyjson.com/data/products/2/1.jpg",
        "https://i.dummyjson.com/data/products/2/2.jpg",
        "https://i.dummyjson.com/data/products/2/3.jpg",
        "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
      ],
      quantity: 1,
      user: 1,
      productId: 2,
      id: 8,
    },
    {
      title: "Huawei P30",
      description:
        "Huawei’s re-badged P30 Pro New Edition was officially unveiled yesterday in Germany and now the device has made its way to the UK.",
      price: 499,
      discountPercentage: 10.58,
      rating: 4.09,
      stock: 32,
      brand: "Huawei",
      category: "smartphones",
      thumbnail: "https://i.dummyjson.com/data/products/5/thumbnail.jpg",
      images: [
        "https://i.dummyjson.com/data/products/5/1.jpg",
        "https://i.dummyjson.com/data/products/5/2.jpg",
        "https://i.dummyjson.com/data/products/5/3.jpg",
      ],
      quantity: 1,
      user: 1,
      productId: 5,
      id: 9,
    },
  ],
  totalAmount: 1398,
  totalItems: 2,
  user: {
    email: "rubalsingh1998@gmail.com",
    password: "1212",
    id: 1,
    addresses: [
      {
        name: "Rubal",
        email: "rubalsingh1998@gmail.com",
        phone: "1234",
        country: "India",
        streetAdress: "3e32qe3",
        city: "Batala",
        region: "Punjab",
        pinCode: "12321",
      },
      {
        name: "Rubalasqqs",
        email: "rubalsingh1998@gmail.com",
        phone: "123421321",
        country: "India",
        streetAdress: "3e32qe3213",
        city: "Batala",
        region: "Punjab",
        pinCode: "123211",
      },
      {
        name: "lasan",
        email: "harrysingh@gmail.com",
        phone: "1231212",
        country: "Mexico",
        streetAdress: "`1ascdass",
        city: "Batala",
        region: "String",
        pinCode: "21321",
      },
    ],
  },
  paymentMethod: "cash",
  selectedAdress: {
    name: "Rubal",
    email: "rubalsingh1998@gmail.com",
    phone: "1234",
    country: "India",
    streetAdress: "3e32qe3",
    city: "Batala",
    region: "Punjab",
    pinCode: "12321",
  },
  status: "pending",
  id: 1,
};

const orderSchema = new Schema({
  items: { type: [Schema.Types.Mixed] },
  totalAmount: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // we can use enums here
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "pending" },
  selectedAdress: { type: Schema.Types.Mixed, required: true },
  date: { type: Date },
});

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model("Order", orderSchema);
