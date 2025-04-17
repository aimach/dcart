// import des bibliothèques
import express from "express";
// import des modules
import { blockController } from "../../controllers/storymap/blockController";
// import des validateurs
import { authenticateUser } from "../../middlewares/authenticate";
import {
	validateBlockBody,
	validateEditBlockBody,
} from "../../utils/validator/storymap/block";

export const blockRoutes = express.Router();

// récupère tous les blocs ou un bloc en particulier
blockRoutes.get("/:blockId", blockController.getBlockInfos);

// crée un nouveau bloc
blockRoutes.post(
	"/",
	validateBlockBody,
	authenticateUser,
	blockController.createNewBlock,
);

// met à jour un bloc
blockRoutes.put(
	"/:blockId",
	validateEditBlockBody,
	authenticateUser,
	blockController.updateBlock,
);

// supprime un bloc
blockRoutes.delete("/:blockId", authenticateUser, blockController.deleteBlock);
