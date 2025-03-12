// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";

export const categorySchema = Joi.object({
	id: Joi.string().uuid().optional().allow(null),
	name_fr: Joi.string().required(),
	name_en: Joi.string().required(),
	description_fr: Joi.string().optional().allow(null),
	description_en: Joi.string().optional().allow(null),
});

export const validateCategoryBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { error } = categorySchema.validate(req.body);
	if (error) {
		res.status(422).send({ error: error.details });
	} else {
		next();
	}
};
