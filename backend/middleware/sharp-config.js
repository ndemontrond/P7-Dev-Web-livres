const sharp = require("sharp");
const path = require("path");

const processImage = async (buffer, originalname) => {
    try {
        if (!buffer || buffer.length === 0) {
            throw new Error("Input file buffer is empty or undefined.");
        }

        const timestamp = new Date().toISOString();
        const ref = `${timestamp}-${originalname}.webp`;
        const filePath = path.join(__dirname, "../images/", ref); // Absolute file path
        await sharp(buffer).webp({ quality: 20 }).toFile(filePath);
        const link = `http://localhost:4000/${ref}`;
        console.log("sharp exited with: ", link);
        return link;
    } catch (error) {
        console.error("Error processing image:", error);
        throw error;
    }
};

module.exports = processImage;
