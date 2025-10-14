const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Product = require('../../models/Product');
const { addProduct } = require('../../controller/ProductController');

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route to get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
});

// Configure file upload fields
const uploadFields = [
  { name: 'image', maxCount: 1 },
  { name: 'additionalImages', maxCount: 3 },
];

// Route to add a new product with Cloudinary
router.post('/add', upload.fields(uploadFields), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      category,
      brand,
      featured,
      specs,
    } = req.body;

    const newProduct = {
      name,
      description,
      price,
      quantity,
      category,
      brand,
      featured: featured === "true",
      specs: JSON.parse(specs || "{}"),
    };

    // Upload main image to Cloudinary
    if (req.files?.image && req.files.image[0]) {
      const mainImage = req.files.image[0];
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error, result) => {
          if (error) throw error;
          newProduct.imageUrl = result.secure_url;
        }
      );
      // For memory storage, we need to write buffer to stream
      require('streamifier').createReadStream(mainImage.buffer).pipe(result);
    }

    // Upload additional images
    newProduct.images = [];
    if (req.files?.additionalImages) {
      for (const file of req.files.additionalImages) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          require('streamifier').createReadStream(file.buffer).pipe(stream);
        });
        newProduct.images.push(uploadResult.secure_url);
      }
    }

    const product = await Product.create(newProduct);
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Error adding product', error: error.message });
  }
});

// Route to update a product with Cloudinary
router.put("/:id", upload.fields(uploadFields), async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      brand: req.body.brand,
      featured: req.body.featured === "true",
      specs: JSON.parse(req.body.specs || "{}"),
    };

    // Main image
    if (req.files?.image && req.files.image[0]) {
      const mainImage = req.files.image[0];
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
        require('streamifier').createReadStream(mainImage.buffer).pipe(stream);
      });
      updateData.imageUrl = result.secure_url;
    } else if (req.body.existingImage) {
      updateData.imageUrl = req.body.existingImage;
    }

    // Additional images
    let existingAdditionalImages = [];
    if (req.body.existingAdditionalImages) {
      if (typeof req.body.existingAdditionalImages === "string") {
        existingAdditionalImages = [req.body.existingAdditionalImages];
      } else {
        existingAdditionalImages = req.body.existingAdditionalImages;
      }
    }

    let uploadedAdditionalImages = [];
    if (req.files?.additionalImages) {
      for (const file of req.files.additionalImages) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
          require('streamifier').createReadStream(file.buffer).pipe(stream);
        });
        uploadedAdditionalImages.push(result.secure_url);
      }
    }

    updateData.images = [...existingAdditionalImages, ...uploadedAdditionalImages];

    const updated = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json({ product: updated });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
});

// Route to delete a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;
