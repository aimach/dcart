// import des controllers
import { authController } from "../../auth/authController";
import { attestationController } from "../../common/attestationController";
import { tagController } from "./tagController";
import { colorController } from "../../common/colorController";
import { filterController } from "./filterController";
import { iconController } from "../../common/iconController";
import { mapContentController } from "./mapContentController";

export const dcartControllers = {
	...authController,
	...mapContentController,
	...tagController,
	...filterController,
	...iconController,
	...attestationController,
	...colorController,
};
