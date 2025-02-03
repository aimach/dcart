// import des controllers
import { authController } from "./authController";
import { categoryController } from "./categoryController";
import { mapContentController } from "./mapContentController";

export const dcartControllers = {
	...authController,
	...mapContentController,
	...categoryController,
};
