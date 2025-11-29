import type { Request, Response } from "express";
import { handleError } from "../../utils/errorHandler/errorHandler";
import { processImage } from "../../utils/media/imageProcessor";

export const mediaController = {
  uploadImage: async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req.user);
      if (!req.file) {
        res.status(400).json({ message: "Aucun fichier fourni." });
        return;
      }

      const processedImages = await processImage(req.file.buffer);

      // Construire les URLs complètes
      const protocol = req.protocol;
      const host = req.get("host");
      const baseUrl = `${protocol}://${host}`;

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
};
