// import des bibliothèques
import express from "express";
// import des modules
import { dcartControllers } from "../controllers/dcartControllers";
import { validateLoginBody } from "../utils/validator/login";

export const authRouter = express.Router();

// inscription
authRouter.post("/register", dcartControllers.register);

// connexion
authRouter.post("/login", validateLoginBody, dcartControllers.login);

// vérification que l'utilisation est connecté
authRouter.get("/verification", dcartControllers.isAuthenticated);
