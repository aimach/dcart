// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";

export const pointSchema = Joi.object({
	id: Joi.string().uuid().optional(),
	color: Joi.string().optional().allow(null),
	description_lang1: Joi.string().optional().allow(null),
	description_lang2: Joi.string().optional().allow(null),
	extraction: Joi.string().optional().allow(null),
	great_region: Joi.string().optional().allow(null),
	latitude: Joi.number().precision(6).optional().allow(null),
	longitude: Joi.number().precision(6).optional().allow(null),
	pane: Joi.string().optional().allow(null),
	location: Joi.string().optional(),
	sub_region: Joi.string().optional().allow(null),
	title_lang1: Joi.string().optional().allow(null),
	title_lang2: Joi.string().optional().allow(null),
	translation_fr: Joi.string().optional().allow(null),
	translation_en: Joi.string().optional().allow(null),
	transliteration: Joi.string().optional().allow(null),
});

export const groupedPoint = Joi.object({
	attestations: Joi.array().items(pointSchema).optional(),
	latitude: Joi.number().precision(6).optional().allow(null),
	longitude: Joi.number().precision(6).optional().allow(null),
	pane: Joi.string().optional().allow(null),
	color: Joi.string().optional().allow(null),
});

const parsedPointsSchema = Joi.object({
	parsedPoints: Joi.array().items(pointSchema).required(),
});

export const validatePointsBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = parsedPointsSchema.validate(req.body);
	if (error) {
		res.status(422).send({ erreur: error.details[0].message });
	} else {
		next();
	}
};
