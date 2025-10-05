const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
});

module.exports = router;