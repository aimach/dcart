import type { Request, Response } from "express";
import { handleError } from "../../utils/errorHandler/errorHandler";
import { deleteImage, processImage } from "../../utils/media/imageProcessor";

export const mediaController = {
  uploadImage: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "Aucun fichier fourni." });
        return;
      }

      const processedImages = await processImage(req.file.buffer);

      // EN PROD : On utilise l'URL définie dans le .env (ex: https://monsite.com)
      // EN LOCAL : On continue d'utiliser req.protocol + host
      const baseUrl =
        process.env.MEDIA_PUBLIC_URL || `${req.protocol}://${req.get("host")}`;

      const response = {
        original: `${baseUrl}${processedImages.original}`,
        medium: `${baseUrl}${processedImages.medium}`,
        thumb: `${baseUrl}${processedImages.thumb}`,
      };

      res.status(201).json(response);
    } catch (error) {
      handleError(res, error as Error);
    }
  },

  deleteImage: async (req: Request, res: Response): Promise<void> => {
    try {
      const { filename } = req.params;
      console.log(`Demande de suppression pour : ${filename}`);

      if (!filename) {
        res.status(400).json({ message: "Nom de fichier manquant." });
        return;
      }

      await deleteImage(filename);

      res.status(200).json({ message: "Image supprimée avec succès." });
    } catch (error) {
      console.error("Erreur controller deleteImage:", error);
      handleError(res, error as Error);
    }
  },
};
