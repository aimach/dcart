// import des bibliothèques
import express from "express";
// import des services
import { dcartControllers } from "../controllers/builtMap/dcartControllers";
// import des middlewares
import { validateLoginBody } from "../utils/validator/login";

export const authRoutes = express.Router();

// inscription
authRoutes.post("/register", dcartControllers.register);

// connexion
authRoutes.post("/login", validateLoginBody, dcartControllers.login);

// déconnexion de l'utilisateur
authRoutes.get("/logout", dcartControllers.logout);

// génération d'un nouveau token d'accès
authRoutes.post("/refresh-token", dcartControllers.refreshToken);
