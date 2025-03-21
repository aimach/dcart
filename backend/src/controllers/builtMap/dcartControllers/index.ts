// import des controllers
import { authController } from "../../auth/authController";
import { attestationController } from "./attestationController";
import { categoryController } from "./categoryController";
import { filterController } from "./filterController";
import { iconController } from "./iconController";
import { mapContentController } from "./mapContentController";

export const dcartControllers = {
	...authController,
	...mapContentController,
	...categoryController,
	...filterController,
	...iconController,
	...attestationController,
};
