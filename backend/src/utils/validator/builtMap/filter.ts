// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";

const filterSchema = Joi.object({
	location: Joi.boolean().required().messages({
		"any.required": "Le booléen 'location' est requis",
		"boolean.base": "'location' doit être un booléen",
	}),
	language: Joi.boolean().required().messages({
		"any.required": "Le booléen 'language' est requis",
		"boolean.base": "'language' doit être un booléen",
	}),
	element: Joi.boolean().required().messages({
		"any.required": "Le booléen 'element' est requis",
		"boolean.base": "'element' doit être un booléen",
	}),
	divinityNb: Joi.boolean().required().messages({
		"any.required": "Le booléen 'divinityNb' est requis",
		"boolean.base": "'divinityNb' doit être un booléen",
	}),
	sourceType: Joi.boolean().required().messages({
		"any.required": "Le booléen 'sourceType' est requis",
		"boolean.base": "'sourceType' doit être un booléen",
	}),
	agentActivity: Joi.boolean().required().messages({
		"any.required": "Le booléen 'agentActivity' est requis",
		"boolean.base": "'agentActivity' doit être un booléen",
	}),
	agentGender: Joi.boolean().required().messages({
		"any.required": "Le booléen 'agentGender' est requis",
		"boolean.base": "'agentGender' doit être un booléen",
	}),
	agentStatus: Joi.boolean().required().messages({
		"any.required": "Le booléen 'agentStatus' est requis",
		"boolean.base": "'agentStatus' doit être un booléen",
	}),
	agentivity: Joi.boolean().required().messages({
		"any.required": "Le booléen 'agentivity' est requis",
		"boolean.base": "'agentivity' doit être un booléen",
	}),
	sourceMaterial: Joi.boolean().required().messages({
		"any.required": "Le booléen 'sourceMaterial' est requis",
		"boolean.base": "'sourceMaterial' doit être un booléen",
	}),
});

export const validateFilterBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = filterSchema.validate(req.body);
	if (error) {
		res.status(422).send({ erreur: error.details[0].message });
	} else {
		next();
	}
};
