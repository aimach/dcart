// import des bibliothèques
import express from "express";
// import des modules
import { blockController } from "../../controllers/storymap/blockController";
import {
	validateBlockArrayBody,
	validateBlockBody,
} from "../../utils/validator/storymap/block";

export const blockRoutes = express.Router();

// récupère tous les blocs ou un bloc en particulier
blockRoutes.get("/:blockId", blockController.getBlockInfos);

// crée un nouveau bloc
blockRoutes.post("/", validateBlockBody, blockController.createNewBlock);

// met à jour un bloc
blockRoutes.put("/:blockId", validateBlockBody, blockController.updateBlock);

// met à jour la position du bloc
blockRoutes.put(
	"/position/update",
	validateBlockArrayBody,
	blockController.updateBlocksPosition,
);

// supprime un bloc
blockRoutes.delete("/:blockId", blockController.deleteBlock);
