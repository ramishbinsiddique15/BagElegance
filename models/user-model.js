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
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    quantity: { type: Number, default: 1 }
  }],
  orders: {
    type: Array,
    default: [],
  },
  contact: Number,
  picture: String,
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model("user", userSchema);
