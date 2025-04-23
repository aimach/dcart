// import des controllers
import { datationController } from "./datationController";
import { elementController } from "./elementController";
import { locationController } from "./locationController";
import { sourceController } from "./sourceController";
import { sourceTypeController } from "./sourceTypeController";

export const mapController = {
	...sourceController,
	...locationController,
	...elementController,
	...datationController,
	...sourceTypeController,
};
