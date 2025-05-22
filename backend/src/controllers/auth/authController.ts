// import des bibliothèques
import argon2 from "argon2";
import { randomBytes } from "node:crypto";
// import des entités
import { User } from "../../entities/auth/User";
import { RefreshToken } from "../../entities/auth/RefreshToken";
import { dcartDataSource } from "../../dataSource/dataSource";
// import des services
import { jwtService } from "../../utils/jwt";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";
import type jwt from "jsonwebtoken";

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
			const { pseudo, password } = req.body;

			// vérification de la présence de l'utilisateur dans la BDD, sinon message d'erreur
			const user = await User.findOneBy({ pseudo });
			if (!user) {
				res.status(404).json({ message: "Utilisateur non trouvé." }).end;
				return;
			}

			// vérification que le mot de passe correspond, sinon message d'erreur
			const isMatch = await argon2.verify((user as User).password, password);
			if (!isMatch) {
				res.status(403).json({ message: "Mot de passe incorrect." });
				return;
			}

			// génération des tokens
			const accessToken = jwtService.generateAccessToken(user.id, user.status);
			// vérification de l'existence du refreshToken
			const refreshTokenInDB = await dcartDataSource
				.getRepository(RefreshToken)
				.findOne({ where: { user: user } });

			// s'il en existe déjà un, suppression du refreshToken en base
			if (refreshTokenInDB?.token) {
				await dcartDataSource.getRepository(RefreshToken).delete({
					token: refreshTokenInDB.token,
				});
			}

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
			handleError(res, error as Error);
		}
	},

	getProfile: async (req: Request, res: Response): Promise<void> => {
		try {
			const { userId } = req.params;
			// const { userId } = req.user as jwt.JwtPayload;

			if (userId === "all") {
				const users = await User.find({
					select: ["id", "username", "pseudo", "status"],
					order: { pseudo: "ASC" },
				});
				res.status(200).json(users);
				return;
			}

			const user = await User.findOne({
				where: { id: userId },
				select: ["id", "username", "pseudo", "status"],
			});

			if (!user) {
				res.status(404).json({ message: "Utilisateur non trouvé." });
				return;
			}

			res.status(200).json(user);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	refreshToken: async (req: Request, res: Response): Promise<void> => {
		try {
			const { refreshToken } = req.cookies;

			if (!refreshToken) {
				res.status(403).json({ message: "Non autorisé" });
				return;
			}

			// vérification du token
			const decoded = jwtService.verifyToken(refreshToken) as jwt.JwtPayload;
			const newAccessToken = jwtService.generateAccessToken(
				decoded.userId,
				decoded.userStatus,
			);

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
			handleError(res, error as Error);
		}
	},

	updateUserStatus: async (req: Request, res: Response): Promise<void> => {
		try {
			const { userId } = req.params;

			// récupération de l'utilisateur
			const user = await dcartDataSource.getRepository(User).findOneBy({
				id: userId,
			});

			if (!user) {
				res.status(404).json({ message: "Utilisateur non trouvé." });
				return;
			}

			// mise à jour du statut de l'utilisateur
			user.status = user.status === "admin" ? "writer" : "admin";
			await dcartDataSource.getRepository(User).save(user);

			res.status(200).json({ message: "Statut utilisateur mis à jour" });
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	deleteUser: async (req: Request, res: Response): Promise<void> => {
		try {
			const { userId } = req.params;

			// suppression de l'utilisateur
			await dcartDataSource.getRepository(User).delete({ id: userId });

			res.status(200).json({ message: "Utilisateur supprimé" });
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	resetPassword: async (req: Request, res: Response): Promise<void> => {
		const { email } = req.body;

		const user = await dcartDataSource.getRepository(User).findOneBy({
			email,
		});

		if (!user) {
			res.status(404).json({ message: "Utilisateur non trouvé." });
			return;
		}

		const resetToken = randomBytes(32).toString("hex");
		user.resetToken = resetToken;
		user.resetTokenExpiration = new Date(Date.now() + 1000 * 60 * 60); // 1h

		await dcartDataSource.getRepository(User).save(user);

		const resetLink = `http://${process.env.APP_HOST}:${process.env.APP_PORT}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

		// TODO: envoie l'email ici (Mailjet, Sendinblue, etc)
		console.log(`Envoyer à ${email}: ${resetLink}`);

		res.json({ message: "Lien de réinitialisation envoyé" });
	},
};
