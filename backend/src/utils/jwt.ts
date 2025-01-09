// import des bibliothèques
import jwt from "jsonwebtoken";

const secretJWtKey = process.env.JWT_SECRET;

export const jwtService = {
	generateToken: (userId: number) => {
		return jwt.sign({ userId }, secretJWtKey as string, { expiresIn: "2h" });
	},

	verifyToken: (token: string) => {
		return jwt.verify(token, secretJWtKey as string);
	},
};
