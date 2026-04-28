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
  ],
  purchased: [
  {
    name: String, 
    product: { type: Number, ref: 'Product' }, //data.id
    quantity: Number, 
    price: Number, // data.price
    purchasedAt: { type: Date, default: Date.now } // new Date()
  }
]
})

module.exports = mongoose.model("user", userSchema);