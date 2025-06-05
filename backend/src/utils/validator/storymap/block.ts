// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";
// import des schémas
import { pointSchema } from "./point";

const blockToCreateSchema = Joi.object({
	id: Joi.string().uuid().optional(),
	content1_lang1: Joi.string().required().messages({
		"any.required": "Le champ 'content1_lang1' est requis",
		"string.base": "'content1_lang1' doit être une chaîne de caractères",
	}),
	content1_lang2: Joi.string().required().messages({
		"any.required": "Le champ 'content2_lang1' est requis",
		"string.base": "'content2_lang1' doit être une chaîne de caractères",
	}),
	content2_lang1: Joi.string().optional().allow("").allow(null),
	content2_lang2: Joi.string().optional().allow("").allow(null),
	content3: Joi.string().optional().allow(null),
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

const validateBlockBody = (req: Request, res: Response, next: NextFunction) => {
	if (req.body.typeName === "separator") {
		return next();
	}
	const validation = blockToCreateSchema.validate(req.body);

	if (validation?.error) {
		res.status(422).send({ erreur: validation?.error.details[0].message });
	} else {
		next();
	}
};

export const blockToEditSchema = Joi.object({
	id: Joi.string().uuid().required(),
	content1_lang1: Joi.string().required(),
	content1_lang2: Joi.string().required(),
	content2_lang1: Joi.string().optional().allow(null),
	content2_lang2: Joi.string().optional().allow(null),
	content3: Joi.string().optional().allow(null),
	position: Joi.number().integer().optional().allow(null),
	createdAt: Joi.date().iso().required(),
	updatedAt: Joi.date().iso().required(),
	type: Joi.object({
		id: Joi.string().uuid().required(),
		name: Joi.string().required(),
	}).required(),
	typeName: Joi.string().optional().allow(null).messages({
		"string.base": "Le champ 'typeId' doit être un uuid",
	}),
	children: Joi.array().optional(),
	points: Joi.array().items(pointSchema).optional(),
	storymapId: Joi.string().uuid().required(),
	parentId: Joi.string().uuid().optional().allow(null),
	groupedPoints: Joi.array().optional(),
	attestations: Joi.array().optional(),
});

const validateEditBlockBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { blockId } = req.params;

	if (blockId === "position") {
		return next();
	}
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

const validateBlockArrayBody = (
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

export { validateBlockBody, validateEditBlockBody, validateBlockArrayBody };
