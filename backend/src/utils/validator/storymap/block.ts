// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";

const blockToCreateSchema = Joi.object({
	id: Joi.string().uuid().optional(),
	content1_fr: Joi.string().required().messages({
		"any.required": "Le champ content1_fr est requis",
		"string.base": "'content1_fr' doit être une chaîne de caractères",
	}),
	content1_en: Joi.string().required().messages({
		"any.required": "Le champ content2_fr est requis",
		"string.base": "'content2_fr' doit être une chaîne de caractères",
	}),
	content2_fr: Joi.string().optional().allow("").allow(null),
	content2_en: Joi.string().optional().allow("").allow(null),
	position: Joi.number().integer().optional().allow(null),
	createdAt: Joi.date().optional(),
	updatedAt: Joi.date().optional(),
	storymapId: Joi.string().uuid().required().messages({
		"any.required": "Le champ storymapId est requis",
		"string.base": "Le champ 'storymapId' doit être un uuid",
	}),
	typeId: Joi.string().uuid().optional().messages({
		"string.base": "Le champ 'typeId' doit être un uuid",
	}),
	typeName: Joi.string().optional().allow(null).messages({
		"string.base": "Le champ 'typeId' doit être un uuid",
	}),
	parentId: Joi.string().uuid().optional().allow(null),
});

export const validateBlockBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = blockToCreateSchema.validate(req.body);
	if (error) {
		res.status(422).send({ erreur: error.details[0].message });
	} else {
		next();
	}
};

export const blockToEditSchema = Joi.object({
	id: Joi.string().uuid().required(),
	content1_fr: Joi.string().required(),
	content1_en: Joi.string().required(),
	content2_fr: Joi.string().optional().allow(null),
	content2_en: Joi.string().optional().allow(null),
	position: Joi.number().integer().required(),
	createdAt: Joi.date().iso().required(),
	updatedAt: Joi.date().iso().required(),
	type: Joi.object({
		id: Joi.string().uuid().required(),
		name: Joi.string().required(),
	}).required(),
	typeName: Joi.string().optional().allow(null).messages({
		"string.base": "Le champ 'typeId' doit être un uuid",
	}),
	children: Joi.array()
		.items(
			Joi.object({
				id: Joi.string().uuid().required(),
			}),
		)
		.optional(),
	storymapId: Joi.string().uuid().required().messages({
		"any.required": "Le champ storymapId est requis",
		"string.base": "Le champ 'storymapId' doit être un uuid",
	}),
	parentId: Joi.string().uuid().optional().allow(null),
});

export const validateEditBlockBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = blockToEditSchema.validate(req.body);
	if (error) {
		res.status(422).send({ erreur: error.details[0].message });
	} else {
		next();
	}
};

const blockArraySchema = Joi.object({
	blocks: Joi.array().items(blockToEditSchema).required(),
});

export const validateBlockArrayBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = blockArraySchema.validate(req.body);
	if (error) {
		res.status(422).send({ erreur: error.details[0].message });
	} else {
		next();
	}
};
