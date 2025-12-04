const express = require('express');
const router = express.Router();
const Subcategory = require('../db/subcategory');
const { addSubcategory, updateSubcategory, deleteSubcategory } = require('../handlers/subcategory-handler');

router.post("", async (req, res) => {
    let model = req.body;
    let result = await addSubcategory(model);
    res.send(result);
});

router.put("/:id", async (req, res) => {
    let model = req.body;
    let id = req.params['id'];
    let result = await updateSubcategory(id, model);
    res.send(result);
});

router.get("", async (req, res) => {
    let subcategories = await Subcategory.find();
    return res.send(subcategories.map(subcategory => subcategory.toObject()));
});

router.get("/category/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const result = await Subcategory.find({ categoryId }); // <-- filter by categoryId
    res.send(result);
  } catch (error) {
    console.error("Error fetching subcategories by category:", error);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
    let id = req.params['id'];
    await deleteSubcategory(id);
    return res.send({ message: "Subcategory deleted successfully" });
});

module.exports = router;