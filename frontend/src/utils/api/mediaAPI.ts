import { notifyError } from "../functions/toast";
import { apiClient } from "./apiClient";

/**
 * Upload une image vers le serveur
 * @param file Le fichier à uploader
 * @returns L'objet contenant les URLs des images générées (original, medium, thumb) ou null en cas d'erreur
 */
export const uploadImage = async (
  file: File
): Promise<{ original: string; medium: string; thumb: string } | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/dcart/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image", error);
    notifyError("Erreur lors de l'upload de l'image");
    return null;
  }
};

/**
 * Supprime une image du serveur
 * @param filename Le nom du fichier ou l'URL complète
 */
export const deleteImage = async (filename: string): Promise<boolean> => {
  try {
    const cleanFilename = filename.split("/").pop();

    if (!cleanFilename) return false;

    const response = await apiClient.delete(`/dcart/media/${cleanFilename}`);

    return response.status === 200;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image", error);
    return false;
  }
};
