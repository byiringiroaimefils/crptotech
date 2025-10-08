const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    inStock: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    specs: {
        Display: { type: String, default: "" },
        Camera: { type: String, default: "" },
        Storage: { type: String, default: "" },
        Battery: { type: String, default: "" }
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);