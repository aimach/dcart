// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";

const newMapContentSchema = Joi.object({
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
	description_en: Joi.string().required().messages({
		"string.base":
			"La description en anglais doit être une chaîne de caractères",
	}),
	image_url: Joi.string().required().allow("").messages({
		"string.base": "Le lien de l'image doit être une chaîne de caractères",
	}),
	tags: Joi.string(),
	divinity_in_chart: Joi.boolean().required(),
});

const updateMapContentSchema = newMapContentSchema.keys({
	id: Joi.string().uuid().required(),
	slug: Joi.string().optional().allow(null).messages({
		"string.base": "Le slug doit être une chaîne de caractères",
	}),
	isActive: Joi.boolean().required(),
	createdAt: Joi.date().required(),
	updatedAt: Joi.date().required(),
	tags: Joi.alternatives().try(Joi.string(), Joi.array()).required(),
	filters: Joi.array()
		.items(
			Joi.object({
				id: Joi.string().uuid().required(),
			}),
		)
		.optional(),
	isLayered: Joi.boolean().required(),
	isNbDisplayed: Joi.boolean().required(),
	uploadPointsLastDate: Joi.date().required(),
	filterMapContent: Joi.array().required(),
	attestations: Joi.array().required(),
	divinity_in_chart: Joi.boolean().required(),
	modifier: Joi.string().optional().allow(null),
});

export const validateNewMapContentBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = newMapContentSchema.validate(req.body);
	if (error) {
		res.status(422).send({ erreur: error.details[0].message });
	} else {
		next();
	}
};

export const validateUpdatedMapContentBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (!req.query.isActive) {
		const { error } = updateMapContentSchema.validate(req.body);
		if (error) {
			res.status(422).send({ erreur: error.details[0].message });
		} else {
			next();
		}
	} else {
		next();
	}
};
