// import des bibliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../controllers/builtMap/dcartControllers";
// import des validateurs
import { validateLoginBody } from "../utils/validator/login";
import {
	authenticateAdmin,
	authenticateUser,
} from "../middlewares/authenticate";

export const authRoutes = express.Router();

// inscription
authRoutes.post("/register", dcartControllers.register);

// connexion
authRoutes.post("/login", validateLoginBody, dcartControllers.login);

// déconnexion de l'utilisateur
authRoutes.get("/logout", dcartControllers.logout);

// génération d'un nouveau token d'accès
authRoutes.post("/refresh-token", dcartControllers.refreshToken);

// récupération des informations de l'utilisateur
authRoutes.get(
	"/users/:userId",
	authenticateUser,
	authenticateAdmin,
	dcartControllers.getProfile,
);

// modification du statut d'un utilisateur
authRoutes.put(
	"/users/:userId/status",
	authenticateUser,
	authenticateAdmin,
	dcartControllers.updateUserStatus,
);

// suppression d'un utilisateur
authRoutes.delete(
	"/users/:userId",
	authenticateUser,
	authenticateAdmin,
	dcartControllers.deleteUser,
);
