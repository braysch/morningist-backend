const mongoose = require('mongoose');
const { Schema } = mongoose;
const subcategorySchema = new mongoose.Schema({
    name: String,
    categoryId: [{ type: Schema.Types.ObjectId, ref: 'categories' }],
});
const Subcategory = mongoose.model('subcategory', subcategorySchema);
module.exports = Subcategory;