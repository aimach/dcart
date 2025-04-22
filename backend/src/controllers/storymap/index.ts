import { blockController } from "./blockController";
import { tagController } from "./tagController";
import { pointController } from "./pointController";
import { storymapContentControllers } from "./storymapContentController";
import { typeController } from "./typeController";

export const storymapControllers = {
	...blockController,
	...tagController,
	...pointController,
	...storymapContentControllers,
	...typeController,
};
