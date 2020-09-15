const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'  
     },
    customer: {
       type: Schema.Types.ObjectId,
       ref: 'User'  
    },
    date: { type: Date, default: Date.now }

});


const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;