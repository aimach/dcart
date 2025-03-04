// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";

const sourceSchema = Joi.object({
	attestationIds: Joi.string().required().messages({
		"any.required": "La liste des id des attestations est requise",
		"string.base":
			"La liste des id des attestations doit être une chaîne de caractères",
		"string.empty": "La liste des id des attestations ne doit pas être vide",
	}),
});

export const validateSourceBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = sourceSchema.validate(req.body);
	if (error) {
		res.status(422).send({ erreur: error.details[0].message });
	} else {
		next();
	}
};
