// import des bibliothèques
import express from "express";
// import des modules
import { authController } from "../controllers/authController";
import { validateLoginBody } from "../utils/validator/login";

export const authRouter = express.Router();

// inscription
authRouter.post("/register", authController.register);

// connexion
authRouter.post("/login", validateLoginBody, authController.login);

// vérification que l'utilisation est connecté
authRouter.get("/verification", authController.isAuthenticated);
