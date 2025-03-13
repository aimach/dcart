// import des bibliothèques
import express from "express";
// import des modules
import { blockController } from "../../controllers/storymap/blockController";
// import des validateurs
import {
	validateBlockArrayBody,
	validateBlockBody,
} from "../../utils/validator/storymap/block";
import { authenticateUser } from "../../middlewares/authenticate";

export const blockRoutes = express.Router();

// récupère tous les blocs ou un bloc en particulier
blockRoutes.get("/:blockId", blockController.getBlockInfos);

// crée un nouveau bloc
blockRoutes.post(
	"/",
	authenticateUser,
	validateBlockBody,
	blockController.createNewBlock,
);

// met à jour un bloc
blockRoutes.put(
	"/:blockId",
	authenticateUser,
	validateBlockBody,
	blockController.updateBlock,
);

// met à jour la position du bloc
blockRoutes.put(
	"/position/update",
	authenticateUser,
	validateBlockArrayBody,
	blockController.updateBlocksPosition,
);

// supprime un bloc
blockRoutes.delete("/:blockId", authenticateUser, blockController.deleteBlock);
