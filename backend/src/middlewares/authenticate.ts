// import des services
import { jwtService } from "../utils/jwt";
// import des types
import type { Request, Response, NextFunction } from "express";
import type jwt from "jsonwebtoken";

export const authenticateUser = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res.status(401).json({ message: "Accès non autorisé" });
		return;
	}

	// récupération du token après "Bearer"
	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwtService.verifyToken(token) as jwt.JwtPayload;
		req.user = decoded;
		next();
	} catch (error) {
		res.status(403).json({ message: "Token invalide ou expiré" });
	}
};
