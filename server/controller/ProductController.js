const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

exports.addProduct = async (req, res) => {
    try {
        console.log('=================== New Product Request ===================');
        console.log('Headers:', req.headers);
        console.log('Body:', {
            ...req.body,
            specs: req.body.specs ? JSON.parse(req.body.specs) : undefined
        });
        console.log('Files structure:', {
            filesExist: !!req.files,
            fileKeys: req.files ? Object.keys(req.files) : [],
            mainImage: req.files?.['image']?.[0] ? {
                fieldname: req.files['image'][0].fieldname,
                mimetype: req.files['image'][0].mimetype,
                size: req.files['image'][0].size
            } : null
        });

        const { 
            name, description, price, originalPrice, 
            category, brand, inStock, rating, 
            reviewCount, specs: specsString, featured 
        } = req.body;

        // Parse specs JSON string
        let specs = {};
        try {
            if (specsString) {
                specs = JSON.parse(specsString);
            }
        } catch (error) {
            console.error('Error parsing specs:', error);
            return res.status(400).json({
                success: false,
                message: 'Invalid specs format',
                details: 'Specs must be a valid JSON string'
            });
        }

        // Validate required fields
        if (!name || !description || !price || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                details: 'Name, description, price, category, and brand are required'
            });
        }

        // Validate price
        const numPrice = Number(price);
        if (isNaN(numPrice) || numPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price',
                details: 'Price must be a positive number'
            });
        }

        console.log('Validation passed, processing main image...');

        // Handle main image
        const mainImageFile = req.files?.['image']?.[0];
        if (!mainImageFile) {
            return res.status(400).json({ message: 'No main image provided' });
        }

        // Create base64 data URL for Cloudinary upload
        const mainFileStr = mainImageFile.buffer.toString('base64');
        const mainFileType = mainImageFile.mimetype;
        const dataUrl = `data:${mainFileType};base64,${mainFileStr}`;

        console.log('Attempting to upload to Cloudinary...');
        const mainUploadResponse = await cloudinary.uploader.upload(
            dataUrl,
            {
                folder: 'products',
                resource_type: 'auto'
            }
        );

        // Handle additional images
        const additionalImages = req.files?.['additionalImages'] || [];
        console.log('Processing additional images:', additionalImages.length);
        
        const additionalImageUrls = await Promise.all(
            additionalImages.map(async (file) => {
                const fileStr = file.buffer.toString('base64');
                const fileType = file.mimetype;
                const dataUrl = `data:${fileType};base64,${fileStr}`;
                
                const uploadResponse = await cloudinary.uploader.upload(
                    dataUrl,
                    {
                        folder: 'products',
                        resource_type: 'auto'
                    }
                );
                return uploadResponse.secure_url;
            })
        );

        // Create new product
        const product = new Product({
            name,
            description,
            price: Number(price),
            originalPrice: Number(originalPrice) || price,
            category,
            brand,
            imageUrl: mainUploadResponse.secure_url,
            images: additionalImageUrls,
            inStock: inStock === 'true',
            rating: Number(rating) || 0,
            reviewCount: Number(reviewCount) || 0,
            specs, // Use the parsed specs from JSON string
            featured: featured === 'true'
        });

        // Save product to database
        await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            product
        });

    } catch (error) {
        console.error('=================== Error Adding Product ===================');
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            http_code: error.http_code,
            stack: error.stack
        });

        // Determine the appropriate error response
        let statusCode = 500;
        let errorMessage = 'Internal server error while adding product';
        let errorDetails = error.message;

        // Handle specific error types
        if (error.http_code) {
            // Cloudinary error
            statusCode = error.http_code;
            errorMessage = 'Image upload failed';
            errorDetails = `Cloudinary error: ${error.message}`;
        } else if (error.name === 'ValidationError') {
            // Mongoose validation error
            statusCode = 400;
            errorMessage = 'Invalid product data';
            errorDetails = Object.values(error.errors)
                .map(err => err.message)
                .join(', ');
        }

        res.status(statusCode).json({
            success: false,
            message: errorMessage,
            details: errorDetails,
            error: {
                type: error.name,
                code: error.code || 'UNKNOWN_ERROR'
            }
        });
    }
};