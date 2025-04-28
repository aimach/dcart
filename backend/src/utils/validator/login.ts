// import des bibliothèques
import Joi from "joi";
// import des types
import type { Request, Response, NextFunction } from "express";

const loginSchema = Joi.object({
	pseudo: Joi.string().required(),
	password: Joi.string().required(),
});

export const validateLoginBody = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const checkLoginData = loginSchema.validate(req.body);
	if (checkLoginData.error) {
		res.status(422).send({ error: checkLoginData.error.details });
	} else {
		next();
	}
};
