const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        trim: String,
        required: [true, 'Name cannot be blank.'],
        unique: [true, 'Duplicat value not allowed.']
    },
    createdBy: {
        type: String,
        required: true
      },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;