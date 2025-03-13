// import des bibliothèques
import argon2 from "argon2";
// import des entités
import { User } from "../../entities/auth/User";
// import des services
import { jwtService } from "../../utils/jwt";
// import des types
import type { Request, Response } from "express";
import type jwt from "jsonwebtoken";
import { dcartDataSource } from "../../dataSource/dataSource";
import { RefreshToken } from "../../entities/auth/RefreshToken";

export const authController = {
	// cette route existe pour l'instant pour les besoins de développement mais sera supprimée lors de la mise en prod
	register: async (req: Request, res: Response): Promise<void> => {
		try {
			const { pseudo, username, password } = req.body;

			if (!username || !password) {
				res.status(400).json({
					message: "Username et password sont requis.",
				});
				return;
			}

			const hashedPassword = await argon2.hash(password);
			const user = User.create({ username, pseudo, password: hashedPassword });
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

			// vérification de la présence de l'utilisateur dans la BDD, sinon message d'erreur
			const user = await User.findOneBy({ username });
			if (!user) {
				res.status(404).json({ message: "Utilisateur non trouvé." }).end;
				return;
			}

			// vérification que le mot de passe correspond, sinon message d'erreur
			const isMatch = await argon2.verify((user as User).password, password);
			if (!isMatch) {
				res.status(401).json({ message: "Mot de passe incorrect." });
				return;
			}

			// si un token existe déjà dans la BDD, on le supprime
			await dcartDataSource.getRepository(RefreshToken).delete({
				user: user,
			});

			// génération des tokens
			const accessToken = jwtService.generateAccessToken((user as User).id);
			const refreshToken = jwtService.generateRefreshToken((user as User).id);

			// stockage du refreshToken dans la BDD
			await dcartDataSource.getRepository(RefreshToken).save({
				token: refreshToken,
				user: user,
			});

			// stockage du refreshToken dans les cookies et de l'accessToken dans la réponse
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
				secure: process.env.NODE_ENV === "production",
			});
			res.status(200).json({ message: "Connexion réussie", accessToken });
		} catch (error) {
			res.status(500).json({ message: "Erreur serveur", error: error });
		}
	},

	getProfile: async (req: Request, res: Response): Promise<void> => {
		try {
			const { userId } = req.user as jwt.JwtPayload;

			const user = await User.findOne({
				where: { id: userId },
				select: ["id", "username"],
			});

			if (!user) {
				res.status(404).json({ message: "Utilisateur non trouvé." });
				return;
			}

			res.status(200).json({ user });
		} catch (error) {
			res.status(500).json({ message: "Erreur serveur", error: error });
		}
	},

	isAuthenticated: async (req: Request, res: Response): Promise<void> => {
		try {
			const { jwt } = req.cookies;

			const decodedToken = jwtService.verifyToken(jwt) as jwt.JwtPayload;

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

	refreshToken: async (req: Request, res: Response): Promise<void> => {
		try {
			const { refreshToken } = req.cookies;
			if (!refreshToken) {
				res.status(403).json({ message: "Non autorisé" });
				return;
			}

			// vérification si le token est en base
			const tokenInDB = await dcartDataSource
				.getRepository("RefreshToken")
				.count({
					where: { token: refreshToken },
				});

			if (tokenInDB === 0) {
				res.status(403).json({ message: "Refresh token invalide" });
				return;
			}

			// vérification du token
			const decoded = jwtService.verifyToken(refreshToken) as jwt.JwtPayload;
			const newAccessToken = jwtService.generateAccessToken(decoded.userId);

			res.json({ accessToken: newAccessToken });
		} catch (error) {
			res.status(403).json({ message: "Refresh token invalide" });
		}
	},

	logout: async (req: Request, res: Response): Promise<void> => {
		try {
			const { refreshToken } = req.cookies;

			// si le refreshToken n'existe pas, ne rien faire
			if (!refreshToken) {
				res.status(204).send();
				return;
			}

			// suppressino du Refresh Token en base
			await dcartDataSource.getRepository(RefreshToken).delete({
				token: refreshToken,
			});

			// clear le cookie
			res.clearCookie("refreshToken");

			res.status(200).json({ message: "Déconnecté avec succès" });
		} catch (error) {
			res.status(500).json({ message: "Erreur serveur" });
		}
	},
};
