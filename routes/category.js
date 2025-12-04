const express = require('express');
const router = express.Router();
const Category = require('../db/category');
const { addCategory, updateCategory, deleteCategory } = require('../handlers/category-handler');

router.post("", async (req, res) => {
    let model = req.body;
    let result = await addCategory(model);
    res.send(result);
});

router.put("/:id", async (req, res) => {
    let model = req.body;
    let id = req.params['id'];
    let result = await updateCategory(id, model);
    res.send(result);
});

router.get("", async (req, res) => {
    let categories = await Category.find();
    return res.send(categories.map(category => category.toObject()));
});

router.get("/:id", async (req, res) => {
    let id = req.params['id'];
    let result = await Category.findById(id);
    res.send(result);
});

router.delete("/:id", async (req, res) => {
    let id = req.params['id'];
    await deleteCategory(id);
    return res.send({ message: "Category deleted successfully" });
});

module.exports = router;