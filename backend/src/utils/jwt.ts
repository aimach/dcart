// import des bibliothèques
import jwt from "jsonwebtoken";

const secretJWtKey = process.env.JWT_SECRET;

export const jwtService = {
	// génère un token d'accès (15 minutes)
	generateAccessToken: (userId: string) => {
		return jwt.sign({ userId }, secretJWtKey as string, { expiresIn: "2m" });
	},

	// génère un token de rafraichissement (7 jours)
	generateRefreshToken: (userId: string) => {
		return jwt.sign({ userId }, secretJWtKey as string, {
			expiresIn: "3m",
		});
	},

	verifyToken: (token: string) => {
		return jwt.verify(token, secretJWtKey as string);
	},
};
