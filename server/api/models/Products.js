const validator = require("validator");
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

const productsSchema = new Schema({
    productName: {
        type: String,
        trim: String,
        required: [true, 'ProductName cannot be blank.'],
   },
    category: {
        type: Schema.Types.ObjectId, ref: 'Category',
        required: [true, 'Category cannot be blank.'],
    },
    price: {
        type: Number,
        required: [true, 'Price cannot be blank.'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity cannot be blank.'],
    },
    image1:String,
	image2:String,
    createdBy: {
        type: String,
        required: true
      },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productsSchema);

module.exports = Product;