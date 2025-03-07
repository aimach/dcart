// import des bibliothèques
import passport from "passport";
// import des types
import type { Request, Response, NextFunction } from "express";
import type { User } from "../entities/builtMap/User";

export const authenticateJwt = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	passport.authenticate(
		"jwt",
		{ session: false },
		(error: Error, user: User | null) => {
			if (error) return res.status(500).json({ message: "Erreur du serveur" });
			if (!user) return res.status(401).json({ message: "Accès non autorisé" });

			req.user = user;
			next();
		},
	);
};
