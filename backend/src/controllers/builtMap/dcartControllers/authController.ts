// import des bibliothèques
import argon2 from "argon2";
// import des entités
import { User } from "../../../entities/builtMap/User";
// import des services
import { jwtService } from "../../../utils/jwt";
// import des types
import type { Request, Response } from "express";
import type jwt from "jsonwebtoken";

export const authController = {
	// cette route existe pour l'instant pour les besoins de développement mais sera supprimée lors de la mise en prod
	register: async (req: Request, res: Response): Promise<void> => {
		try {
			const { username, password } = req.body;

			if (!username || !password) {
				res.status(400).json({
					message: "Username et password sont requis.",
				});
				return;
			}

			const hashedPassword = await argon2.hash(password);
			const user = User.create({ username, password: hashedPassword });
			await user.save();

			res.status(201).json({
				message: "Utilisateur créé",
				user: { id: user.id, username: user.username },
			});
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({
					message: "Erreur lors de l'inscription",
					error: error.message,
				});
				return;
			}
			res.status(500).json({
				message: "Erreur inattendue",
				error: error,
			});
		}
	},

	login: async (req: Request, res: Response): Promise<void> => {
		try {
			const { username, password } = req.body;

			// on vérifie que l'utilisateur existe dans la BDD, sinon on envoie un message d'erreur
			const user = await User.findOneBy({ username });
			if (!user) {
				res.status(404).json({ message: "Utilisateur non trouvé." }).end;
				return;
			}

			// on vérifie que le mot de passe correspond, sinon on envoie un message d'erreur
			const isMatch = await argon2.verify((user as User).password, password);
			if (!isMatch) {
				res.status(401).json({ message: "Mot de passe incorrect." });
				return;
			}

			// on génére le jwt, on le stocke dans les cookies et on envoie la réponse
			const token = jwtService.generateToken((user as User).id);
			res.cookie("jwt", token, { httpOnly: true });
			res.status(200).json({ message: "Connexion réussie", token });
		} catch (error) {
			res.status(500).json({ message: "Erreur serveur", error: error });
		}
	},

	isAuthenticated: async (req: Request, res: Response): Promise<void> => {
		try {
			const token = req.cookies.jwt;

			const decodedToken = jwtService.verifyToken(token) as jwt.JwtPayload;

			res.status(200).json({
				message: "Utilisateur connecté",
				userId: decodedToken.userId,
			});
		} catch (error) {
			// s'il n'y a pas de jwt dans les cookies, on entre directement dans le catch
			if ((error as Error).message === "jwt expired") {
				// si l'erreur est celle du token expiré, on renvoie un erreur 401
				res.status(401).json({ message: "Utilisateur non connecté" });
			} else {
				res.status(500).json({ message: "Erreur serveur", error: error });
			}
		}
	},
};
