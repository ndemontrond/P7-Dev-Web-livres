const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.signup = async (req, res, next) => {
    try {
        // Check if password meets the minimum length requirement
        if (req.body.password.length < 8) {
            return res
                .status(400)
                .json({
                    error: "Le mot de passe doit contenir au moins 8 caractères.",
                });
        }
        
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res
                .status(409)
                .json({ error: "Un compte avec cet e-mail existe déjà." });
        }

        // If user doesn't exist, proceed with user creation
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: "Utilisateur créé !" });
    } catch (error) {
         if (error.name === "ValidationError") {
             const errors = Object.values(error.errors).map(
                 (err) => err.message
             );
             return res.status(400).json({ errors });
         }
        res.status(500).json({ error: "Une erreur est survenue." });
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        const passwordMatch = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!passwordMatch) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
        }
        const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
        });
        res.status(200).json({
            userId: user._id,
            token: token,
        });
    } catch (error) {
        res.status(500).json({
            error: "Une erreur est survenue lors de l'authentification.",
        });
    }
};