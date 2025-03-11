import { blockController } from "./blockController";
import { categoryController } from "./categoryController";
import { pointController } from "./pointController";
import { storymapContentControllers } from "./storymapContentController";
import { typeController } from "./typeController";

export const storymapControllers = {
	...blockController,
	...categoryController,
	...pointController,
	...storymapContentControllers,
	...typeController,
};
