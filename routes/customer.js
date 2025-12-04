const express = require('express');
const { getNewProudcts, getFeaturedProducts, getProductForListing } = require('../handlers/product-handler');
const { getCategories } = require('../handlers/category-handler');
const router = express.Router();

router.get('/new-products', async (req, res) => {
    const proudcts = await getNewProudcts();
    res.send(proudcts);
});

router.get('/featured-products', async (req, res) => {
    const proudcts = await getFeaturedProducts();
    res.send(proudcts);
});

router.get('/categories', async (req, res) => {
    const categories = await getCategories();
    res.send(categories);
});

router.get('/products', async (req, res) => {
    const { searchTerm, categoryId, page, pageSize, sortBy, sortOrder, brandId } = req.params;
    const products = await getProductForListing(
        searchTerm,
        categoryId,
        page,
        pageSize,
        sortBy,
        sortOrder,
        brandId,
    );
    res.send(products);
});

module.exports = router;