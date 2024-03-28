// Middleware for processing image using Sharp

const sharp = require("sharp");
const path = require("path");

const processImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new Error("No file uploaded."));
        }

        const { buffer, originalname } = req.file;

        const timestamp = new Date().toISOString().replace(/:/g, "_");
        const filename = `${timestamp}-${originalname}`;
        const filePath = path.join(__dirname, "../images/", filename);

        const processedBuffer = await sharp(buffer)
            .webp({ quality: 80 }) 
            .toBuffer();
        await sharp(processedBuffer).toFile(filePath);

        req.filename = filename;
        // Construct the URL for the processed image
        const processedImageUrl = `${req.protocol}://${req.get(
            "host"
        )}/images/${filename}`;
        // Attach the processed image URL to the request object
        req.processedImageUrl = processedImageUrl;

        next();
    } catch (error) {
        console.error("Error processing image:", error);
        throw error;
    }
};

module.exports = processImage;
