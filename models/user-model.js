const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    trim: true,
    minLength: 3,
  },
  email: String,
  password: String,
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  orders: {
    type: Array,
    default: [],
  },
  contact: Number,
  picture: String,
});

module.exports = mongoose.model("user", userSchema);
