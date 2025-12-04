const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    discount: Number,
    images: [String],
    categoryId: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
    subcategoryId: [{ type: Schema.Types.ObjectId, ref: 'subcategories' }],
    isFeatured: Boolean,
    isSeasonal: Boolean,
    dateAdded: { type: Date, default: Date.now },
    serialNumber: String,
    isSold: Boolean,
    isInStoreExclusive: Boolean,
    width: Number, // in
    length: Number, // in
    height: Number, // in
    weight: Number, // oz
});
const Product = mongoose.model('products', productSchema);
module.exports = Product;