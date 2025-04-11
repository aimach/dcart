// import des bibliothèques
import jwt from "jsonwebtoken";

const secretJWtKey = process.env.JWT_SECRET;

export const jwtService = {
	// génère un token d'accès (15 minutes)
	generateAccessToken: (userId: string, userStatus: string) => {
		return jwt.sign({ userId, userStatus }, secretJWtKey as string, { expiresIn: "15m" });
	},

	// génère un token de rafraichissement (7 jours)
	generateRefreshToken: (userId: string) => {
		return jwt.sign({ userId }, secretJWtKey as string, {
			expiresIn: "7d",
		});
	},

	verifyToken: (token: string) => {
		return jwt.verify(token, secretJWtKey as string);
	},
};
