// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";

const mapContentSchema = Joi.object({
	id: Joi.string().uuid().optional(),
	title_fr: Joi.string().required().messages({
		"any.required": "Le nom en français est requis",
		"string.base": "Le nom en français doit être une chaîne de caractères",
	}),
	title_en: Joi.string().required().messages({
		"any.required": "Le nom en anglais est requis",
		"string.base": "Le nom en anglais doit être une chaîne de caractères",
	}),
	description_fr: Joi.string().optional().allow("").messages({
		"string.base":
			"La description en français doit être une chaîne de caractères",
	}),
	description_en: Joi.string().optional().allow("").messages({
		"string.base":
			"La description en anglais doit être une chaîne de caractères",
	}),
	image_url: Joi.string().optional().allow("").messages({
		"string.base": "Le lien de l'image doit être une chaîne de caractères",
	}),
	attestationIds: Joi.string().required().messages({
		"any.required": "La liste des id des attestations est requise",
		"string.base":
			"La liste des id des attestations doit être une chaîne de caractères",
	}),
	divinityIds: Joi.string().optional().allow("").allow(null),
	isActive: Joi.boolean().optional(),
	createdAt: Joi.date().optional(),
	updatedAt: Joi.date().optional(),
	category: Joi.alternatives(
		Joi.object({
			id: Joi.string().uuid().required(),
		}).optional(),
		Joi.string().optional(),
	),
	filters: Joi.array()
		.items(
			Joi.object({
				id: Joi.string().uuid().required(),
			}),
		)
		.optional(),
});

export const validateMapContentBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = mapContentSchema.validate(req.body);
	if (error) {
		res.status(422).send({ erreur: error.details[0].message });
	} else {
		next();
	}
};
