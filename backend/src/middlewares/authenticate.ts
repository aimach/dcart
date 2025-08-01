// import des bibliothèques
import type jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
// import des services
import { dcartDataSource } from "../dataSource/dataSource";
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
	userStatus: "admin" | "writer";
	userId: string;
}

export const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	// récupération du token après "Bearer"
	const token = authHeader?.split(" ")[1];

	try {
		const decoded = jwtService.verifyToken(token as string) as UserPayload;

		if (!decoded) {
			res.status(401).json({ message: "Token invalide ou expiré" });
			return;
		}

		// récupération de l'utilisateur
		const authenticatedUser = await dcartDataSource
			.getRepository("User")
			.findOne({
				where: { id: decoded.userId },
				select: { id: true, status: true, email: true },
			});

		if (!authenticatedUser) {
			res.status(401).json({ message: "Utilisateur non trouvé" });
			return;
		}

		req.user = {
			userId: authenticatedUser.id,
			userStatus: authenticatedUser.status,
			userEmail: authenticatedUser.email,
		};
		next();
	} catch (error) {
		res.status(401).json({ message: "Token invalide ou expiré" });
	}
};

export const authenticateAdmin = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if ((req.user as UserPayload)?.userStatus === "admin") {
			next();
		} else {
			res.status(403).json({ message: "Accès refusé" });
		}
	} catch (error) {
		res.status(401).json({ message: "Token invalide ou expiré" });
	}
};

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // limite chaque IP à 5 requêtes par fenêtre
	message: "Trop de tentatives de connexion. Veuillez réessayer plus tard.",
	standardHeaders: true, // Retourne les informations de limite dans les en-têtes `RateLimit-*`
	legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*`
});
