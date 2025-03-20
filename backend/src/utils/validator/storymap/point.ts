// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";

const pointSchema = Joi.object({
	color: Joi.string().optional().allow(null),
	description_en: Joi.string().optional().allow(null),
	description_fr: Joi.string().optional().allow(null),
	extraction: Joi.string().required(),
	great_region: Joi.string().optional().allow(null),
	latitude: Joi.number().precision(6).optional().allow(null),
	longitude: Joi.number().precision(6).optional().allow(null),
	pane: Joi.string().optional().allow(null),
	location: Joi.string().optional().allow(null),
	sub_region: Joi.string().optional().allow(null),
	title_en: Joi.string().optional().allow(null),
	title_fr: Joi.string().optional().allow(null),
	translation_fr: Joi.string().required(),
	transliteration: Joi.string().optional().allow(null),
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
