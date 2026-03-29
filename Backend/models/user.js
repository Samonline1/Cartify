const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: String, 
    email : String,
    password: String, 
    cart: [
    {
      product: {
        type: Number,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
})

module.exports = mongoose.model("user", userSchema);