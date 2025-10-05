const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addProduct } = require('../../controller/ProductController');
const Product = require('../../models/Product');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
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

// Configure file upload fields
const uploadFields = [
    { name: 'image', maxCount: 1 },
    { name: 'additionalImages', maxCount: 3 }
];

// Route to add a new product
router.post('/add', upload.fields(uploadFields), addProduct);

module.exports = router;