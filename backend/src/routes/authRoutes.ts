// import des bibliothèques
import express from "express";
// import des modules
import { dcartControllers } from "../controllers/dcartControllers";
import { validateLoginBody } from "../utils/validator/login";

export const authRoutes = express.Router();

// inscription
authRoutes.post("/register", dcartControllers.register);

// connexion
authRoutes.post("/login", validateLoginBody, dcartControllers.login);

// vérification que l'utilisation est connecté
authRoutes.get("/verification", dcartControllers.isAuthenticated);
