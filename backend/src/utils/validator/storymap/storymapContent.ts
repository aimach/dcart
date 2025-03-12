// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";
// import des schémas
import { blockToEditSchema } from "./block";
import { categorySchema } from "../builtMap/category";

const storymapContentSchema = Joi.object({
	title_fr: Joi.string().max(255).required(),
	title_en: Joi.string().max(255).required(),
	description_fr: Joi.string().optional().allow(null),
	description_en: Joi.string().optional().allow(null),
	image_url: Joi.string().optional().allow(null),
	author: Joi.string().max(255).optional().allow(null),
	publishedAt: Joi.string().optional().allow(null),
	createdAt: Joi.date().optional(),
	updatedAt: Joi.date().optional(),
	blocks: Joi.array().items(blockToEditSchema).min(0).optional(),
	category_id: Joi.string().uuid().required(),
});

export const validateStorymapContentBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = storymapContentSchema.validate(req.body);
	if (error) {
		res.status(422).send({ erreur: error.details[0].message });
	} else {
		next();
	}
};

const storymapToEditSchema = Joi.object({
	id: Joi.string().uuid().required(),
	title_fr: Joi.string().max(255).required(),
	title_en: Joi.string().max(255).required(),
	description_fr: Joi.string().optional().allow(null),
	description_en: Joi.string().optional().allow(null),
	image_url: Joi.string().optional().allow(null),
	author: Joi.string().max(255).optional().allow(null),
	publishedAt: Joi.string().optional().allow(null),
	createdAt: Joi.date().required(),
	updatedAt: Joi.date().required(),
	blocks: Joi.array().items(blockToEditSchema).min(0).optional(),
	category: categorySchema.required(),
	category_id: Joi.string().uuid().required(),
});

export const validateStorymapContentToEditBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = storymapToEditSchema.validate(req.body);
	if (error) {
		res.status(422).send({ erreur: error.details[0].message });
	} else {
		next();
	}
};
