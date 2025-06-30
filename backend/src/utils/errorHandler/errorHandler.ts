// import des types
import type { Response } from "express";

/**
 * Fonction qui gère les erreurs des controllers
 * @param {Response} res - la réponse
 * @param {Error} error - l'erreur
 */
const handleError = (res: Response, error: Error) => {
	if (
		error.message === "Cannot read properties of undefined (reading 'split')"
	) {
		res.status(400).json({
			message: error.message,
			stack: error.stack,
			error: error,
		});
		return;
	}

	if (error instanceof Error) {
		res.status(500).json({
			message: error.message,
			stack: error.stack,
			error: error,
		});
		return;
	}
	res.status(500).json({
		message: "Erreur inattendue",
		error: error,
	});
};

export { handleError };
