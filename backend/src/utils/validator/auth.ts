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

const passwordSchema = Joi.object({
	newPassword: Joi.string()
		.min(10)
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
		.required()
		.messages({
			"string.min": "Le mot de passe doit contenir au moins 10 caractères",
			"string.pattern.base":
				"Le mot de passe doit contenir une majuscule, une minuscule et un chiffre",
			"string.empty": "Le mot de passe est requis",
		}),
	email: Joi.string().email().required(),
	token: Joi.string().required(),
});

export const validatePassword = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const checkPasswordData = passwordSchema.validate(req.body);
	if (checkPasswordData.error) {
		res.status(422).send({ error: checkPasswordData.error.details });
	} else {
		next();
	}
};
