const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addProduct } = require('../../controller/ProductController');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure file upload fields
const uploadFields = [
    { name: 'image', maxCount: 1 },
    { name: 'additionalImages', maxCount: 3 }
];

// Route to add a new product
router.post('/add', upload.fields(uploadFields), addProduct);

module.exports = router;