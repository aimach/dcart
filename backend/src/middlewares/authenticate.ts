// import des bibliothèques
import type jwt from "jsonwebtoken";
// import des services
import { jwtService } from "../utils/jwt";
// import des types
import type { Request, Response, NextFunction } from "express";

// extension de l'interface Request pour inclure la propriété user
declare global {
	namespace Express {
		interface Request {
			user?: UserPayload;
		}
	}
}

interface UserPayload extends jwt.JwtPayload {
	userStatus: 'admin' | 'writer';
	userId: string;
}

export const authenticateUser = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	// récupération du token après "Bearer"
	const token = authHeader?.split(" ")[1];

	try {
		const decoded = jwtService.verifyToken(token as string) as UserPayload;
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Token invalide ou expiré" });
	}
};

export const authenticateAdmin = (
	req: Request,
	res: Response,
	next: NextFunction,) => {
	try {
		if ((req.user as UserPayload)?.userStatus === "admin") {
			next();
		} else {
			res.status(403).json({ message: "Accès refusé" });
		}
	} catch (error) {
		res.status(401).json({ message: "Token invalide ou expiré" });
	}
}
