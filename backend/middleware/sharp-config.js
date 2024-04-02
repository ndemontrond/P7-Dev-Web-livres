const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const processImage = async (req, res, next) => {
    try {
        if (!req.file) {
            req.processedImageUrl = req.body.imageUrl; // You can change this to a default URL if needed
            return next();
        }

        const { buffer, originalname } = req.file;

        const timestamp = new Date().toISOString().replace(/:/g, "_");
        const filename = `${timestamp}-${path.parse(originalname).name}.webp`;
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

        // console.log("Old image URL:", req.body.oldImageUrl);

        // // Delete the old image file if there's a new file uploaded
        // if (req.file && req.body.oldImageUrl) {
        //     const oldFilename = req.body.oldImageUrl.split("/images/")[1];
        //     const oldImagePath = path.join(__dirname, "../images", oldFilename);
        //     if (fs.existsSync(oldImagePath)) {
        //         fs.unlinkSync(oldImagePath);
        //         console.log(`Deleted old image file: ${oldFilename}`);
        //     } else {
        //         console.log("Old image file not found:", oldImagePath);
        //     }
        // }

        next();
    } catch (error) {
        console.error("Error processing image:", error);
        throw error;
    }
};

module.exports = processImage;
