// import des bibliothèques
import express from "express";
// import des modules
import { dcartControllers } from "../controllers/builtMap/dcartControllers";
import { validateLoginBody } from "../utils/validator/login";
import { authenticateUser } from "../middlewares/authenticate";

export const authRoutes = express.Router();

// inscription
authRoutes.post("/register", dcartControllers.register);

// connexion
authRoutes.post("/login", validateLoginBody, dcartControllers.login);

// déconnexion de l'utilisateur
authRoutes.get("/logout", dcartControllers.logout);

// génération d'un nouveau token d'accès
authRoutes.post("/refresh-token", dcartControllers.refreshToken);
