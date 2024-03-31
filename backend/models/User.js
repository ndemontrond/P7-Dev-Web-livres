const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [emailRegex, "Invalid email format"], // Email format validation
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
