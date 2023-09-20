const mongoose = require("mongoose");

const { Schema } = mongoose;

// {
//     "email": "rubalsingh1998@gmail.com",
//     "password": "1212",
//     "id": 1,
//     "role": "user",
//     "addresses": [
//       {
//         "name": "lasan",
//         "email": "harrysingh2@gmail.com",
//         "phone": "1213213",
//         "country": "Canada",
//         "streetAdress": "231dfgfdgdf",
//         "city": "321",
//         "region": "3sdf",
//         "pinCode": "213"
//       },
//       {
//         "name": "Rubal",
//         "email": "rubalsingh1998@gmail.com",
//         "phone": "1234",
//         "country": "India",
//         "streetAdress": "3e32qe3",
//         "city": "Batala",
//         "region": "Punjab",
//         "pinCode": "12321"
//       },
//     ]
//   },

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: Buffer, required: true },
  role: { type: String, default: "user" },
  addresses: { type: [Schema.Types.Mixed] },
  //TODO - make seperate schema for addresses
  name: { type: String },
  salt: Buffer,
});

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model("User", userSchema);
