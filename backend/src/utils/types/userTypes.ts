import type { User } from "../../entities";

declare global {
	interface Request {
		user?: User; // Utilisateur connecté
	}
}
