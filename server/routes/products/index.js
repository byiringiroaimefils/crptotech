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

// Route to update a product (basic fields, no image upload)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const allowed = [
            'name','description','price','originalPrice','category','brand',
            'inStock','rating','reviewCount','specs','featured','images'
        ];
        const sanitized = {};
        for (const key of allowed) {
            if (update[key] !== undefined) sanitized[key] = update[key];
        }
        const product = await Product.findByIdAndUpdate(id, sanitized, { new: true });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
    }
});

// Route to delete a product
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
    }
});

module.exports = router;