const Subcategory = require("../db/subcategory");

async function addSubcategory(model) {
    let subcategory = new Subcategory({
        name: model.name,
        categoryId: model.categoryId
    });
    await subcategory.save();
    return subcategory.toObject();
}

async function updateSubcategory(id, model) {
   await Subcategory.findOneAndUpdate({_id: id}, model);
   return
}

async function getSubcategorys() {
   let subcategories = await Subcategory.find();
    return subcategories.map(subcategory => subcategory.toObject());
}

async function getSubcategoryById(id) {
   let subcategory = await Subcategory.findById(id);
   return subcategory.toObject();
}

async function deleteSubcategory(id) {
   await Subcategory.deleteOne({_id: id});
   return;
}

module.exports = { addSubcategory, updateSubcategory, getSubcategorys, deleteSubcategory, getSubcategoryById };