// import des controllers
import { authController } from "../../auth/authController";
import { attestationController } from "../../common/attestationController";
import { categoryController } from "./categoryController";
import { colorController } from "../../common/colorController";
import { filterController } from "./filterController";
import { iconController } from "../../common/iconController";
import { mapContentController } from "./mapContentController";

export const dcartControllers = {
	...authController,
	...mapContentController,
	...categoryController,
	...filterController,
	...iconController,
	...attestationController,
	...colorController,
};
