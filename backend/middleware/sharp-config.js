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
            // Example: Resize the image to 500px width
            .resize({ width: 500 })
            //    .webpwebp({ quality: 20 })
            // Other Sharp operations can be added here as needed
            .toBuffer();

        // Write the processed image buffer to file
        await sharp(processedBuffer).toFile(filePath);

        // Set the filename in the request object for further reference
        req.filename = filename;

        console.log("sharp succesfully exited");
        next();
    } catch (error) {
        console.error("Error processing image:", error);
        throw error;
    }
};

module.exports = processImage;
