// import des types
import type { Response } from "express";

const handleError = (res: Response, error: Error) => {
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
