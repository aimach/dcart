import type { InputType } from "../types/formTypes";

const userInputArray: InputType[] = [
	{
		label_fr: "Nom d'utilisateur",
		label_en: "Username",
		description_fr:
			"Le nom qui est affiché dans les champs 'création' et 'modification'",
		description_en:
			"The name that is displayed in the 'creation' and 'modification' fields",
		name: "username",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le nom d'utilisateur est requis",
				en: "The username is required",
			},
		},
	},
	{
		label_fr: "Pseudo",
		label_en: "pseudo",
		description_fr: "Le nom qui est utilisé pour se connecter",
		description_en: "The name that is used to connect",
		name: "pseudo",
		type: "text",
		required: {
			value: true,
			message: {
				fr: "Le pseudo est requis",
				en: "The pseudo is required",
			},
		},
	},
	{
		label_fr: "Adresse mail",
		label_en: "Email address",
		description_fr:
			"L'adresse mail est uniquement utilisée pour définir et réinitialiser le mot de passe",
		description_en:
			"The email adresse is only used to set and reset the password",
		name: "email",
		type: "email",
		required: {
			value: true,
			message: {
				fr: "L'adresse email est requise",
				en: "The email adress is required",
			},
		},
	},
];

export default userInputArray;
