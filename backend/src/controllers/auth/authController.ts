// import des bibliothèques
import bcrypt from "bcryptjs";
import type jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
// import des entités
import { dcartDataSource } from "../../dataSource/dataSource";
import { RefreshToken } from "../../entities/auth/RefreshToken";
import { User } from "../../entities/auth/User";
// import des services
import { handleError } from "../../utils/errorHandler/errorHandler";
import { jwtService } from "../../utils/jwt";
import { sendPasswordResetEmail } from "../../utils/mailer";
// import des types
import type { Request, Response } from "express";

const saltRounds = 10;

export const authController = {
  // cette route existe pour l'instant pour les besoins de développement mais sera supprimée lors de la mise en prod
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { pseudo, username, email } = req.body;

      if (!username || !email || !pseudo) {
        res.status(400).json({
          message: "Données manquantes sont requis.",
        });
        return;
      }

      // vérification de l'unicité de l'email
      const existingUser = await dcartDataSource.getRepository(User).findOneBy({
        email,
      });
      if (existingUser) {
        res.status(400).json({
          message: "Impossible de créer l'utilisateur. Email déjà utilisé.",
        });
        return;
      }

      // vérification de l'unicité du pseudo
      const existingPseudo = await dcartDataSource
        .getRepository(User)
        .findOneBy({
          pseudo,
        });
      if (existingPseudo) {
        res.status(400).json({
          message: "Impossible de créer l'utilisateur. Pseudo déjà utilisé.",
        });
        return;
      }

      const user = User.create({ username, pseudo, email });
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
      // const isMatch = await bcrypt.compare(
      //   password,
      //   (user as User).password as string
      // );
      // if (!isMatch) {
      //   res.status(403).json({ message: "Mot de passe incorrect." });
      //   return;
      // }

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
          select: ["id", "username", "pseudo", "status", "email"],
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
        decoded.userStatus
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

  updateUserProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { username, pseudo, email } = req.body;

      // récupération de l'utilisateur
      const user = await dcartDataSource.getRepository(User).findOne({
        where: { id: userId },
        select: ["id", "username", "pseudo", "email"],
      });

      if (!user) {
        res.status(404).json({ message: "Utilisateur non trouvé." });
        return;
      }

      // vérification que l'utilisateur est bien celui qui fait la requête
      if (user.id !== req.user?.userId) {
        res.status(403).json({ message: "Accès interdit" });
        return;
      }

      // vérification de l'unicité de l'email
      const existingUser = await dcartDataSource.getRepository(User).findOneBy({
        email,
      });
      if (existingUser && existingUser.id !== user.id) {
        res.status(400).json({
          message: "Impossible de modifier le profil. Email déjà utilisé.",
        });
        return;
      }

      // vérification de l'unicité du pseudo
      const existingPseudo = await dcartDataSource
        .getRepository(User)
        .findOneBy({
          pseudo,
        });
      if (existingPseudo && existingPseudo.id !== user.id) {
        res.status(400).json({
          message: "Impossible de modifier le profil. Pseudo déjà utilisé.",
        });
        return;
      }

      // mise à jour des informations de l'utilisateur
      user.username = username;
      user.pseudo = pseudo;
      user.email = email;
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

  resetPasswordRequest: async (req: Request, res: Response): Promise<void> => {
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

    const hostURL =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.APP_HOST}`
        : `http://${process.env.APP_HOST}:${process.env.FRONTEND_PORT}`;

    const resetLink = `${hostURL}/#/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;
    await sendPasswordResetEmail(email, resetLink);

    res.json({ message: "Lien de réinitialisation envoyé" });
  },

  resetPassword: async (req: Request, res: Response): Promise<void> => {
    const { email, token, newPassword } = req.body;

    const user = await dcartDataSource.getRepository(User).findOneBy({
      email,
    });

    if (
      !user ||
      user.resetToken !== token ||
      (user.resetTokenExpiration as Date) < new Date()
    ) {
      res.status(404).json({ message: "Lien invalide ou expiré." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await dcartDataSource.getRepository(User).save(user);
    res.status(200).json({ message: "Mot de passe réinitialisé" });
  },
};
