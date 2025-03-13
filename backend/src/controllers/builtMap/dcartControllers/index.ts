// import des controllers
import { authController } from "../../auth/authController";
import { categoryController } from "./categoryController";
import { filterController } from "./filterController";
import { mapContentController } from "./mapContentController";

export const dcartControllers = {
	...authController,
	...mapContentController,
	...categoryController,
	...filterController,
};
