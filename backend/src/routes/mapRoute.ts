// import des bibliothèques
import express from "express";
// import des modules
import { mapController } from "../controllers/mapController";

export const mapRouter = express.Router();

// récupérer les sources par localité
mapRouter.get("/sources/:elementId", mapController.getSourcesByElementId);
