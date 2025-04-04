// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";
// import des schémas
import { blockToEditSchema } from "./block";

const storymapContentSchema = Joi.object({
	title_lang1: Joi.string().max(255).required(),
	title_lang2: Joi.string().max(255).required(),
	description_lang1: Joi.string().optional().allow(null),
	description_lang2: Joi.string().optional().allow(null),
	image_url: Joi.string().optional().allow(null),
	author: Joi.string().max(255).optional().allow(null),
	publishedAt: Joi.string().optional().allow(null),
	lang1: Joi.string().uuid().required(),
	lang2: Joi.string().uuid().required(),
	createdAt: Joi.date().optional(),
	updatedAt: Joi.date().optional(),
	blocks: Joi.array().items(blockToEditSchema).min(0).optional(),
	category_id: Joi.string().uuid().required(),
	relatedMap: Joi.string().uuid().optional().allow(null),
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
	title_lang1: Joi.string().max(255).required(),
	title_lang2: Joi.string().max(255).required(),
	description_lang1: Joi.string().optional().allow(null),
	description_lang2: Joi.string().optional().allow(null),
	image_url: Joi.string().optional().allow(null),
	author: Joi.string().max(255).optional().allow(null),
	publishedAt: Joi.string().optional().allow(null),
	category_id: Joi.string().uuid().required(),
	lang1: Joi.string().uuid().required(),
	lang2: Joi.string().uuid().required(),
});

export const validateStorymapContentToEditBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	let validation: undefined | Joi.ValidationResult;
	// si ce n'est pas la requête pour mettre à jour le statut de la storymap (qui n'a pas de body)
	if (!req.query.isActive) {
		validation = storymapToEditSchema.validate(req.body);
	}
	if (validation?.error) {
		res.status(422).send({ erreur: validation.error.details[0].message });
	} else {
		next();
	}
};
