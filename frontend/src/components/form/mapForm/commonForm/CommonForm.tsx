// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import des composants
import ErrorComponent from "../../errorComponent/ErrorComponent";
// import du context
import { TranslationContext } from "../../../../context/TranslationContext";
// import des services
import { getAllCategories } from "../../../../utils/loaders/loaders";
// import des types
import type { SubmitHandler } from "react-hook-form";
import type { InputType } from "../../../../utils/types/formTypes";
import type { OptionType } from "../../../../utils/types/commonTypes";
// import du style
import style from "./commonForm.module.scss";
// import des icônes
import { ChevronRight } from "lucide-react";
import { CategoryType } from "../../../../utils/types/mapTypes";

type allInputsType = any;

type CommonFormProps = {
	onSubmit: SubmitHandler<any>;
	inputs: InputType[];
	defaultValues: any | undefined;
};

const CommonForm = ({ onSubmit, inputs, defaultValues }: CommonFormProps) => {
	// on récupère la langue
	const { language } = useContext(TranslationContext);

	// on prépare un state pour le chargement des données
	const [dataLoaded, setDataLoaded] = useState(false);

	// on gère le formulaire
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<allInputsType>({
		defaultValues: defaultValues ?? {},
	});

	// CATEGORIES : on ajoute les options à l'objet input
	const getCategoryOptions = async () => {
		try {
			const allCategories = await getAllCategories();
			const formatedCategoryOptions: OptionType[] = allCategories.map(
				(category: CategoryType) => ({
					value: category.id,
					label: category[`name_${language}`],
				}),
			);
			for (const input of inputs) {
				if (input.name === "categoryId") {
					input.options = formatedCategoryOptions;
				}
			}
			setDataLoaded(true);
		} catch (error) {
			console.error("Erreur lors du chargement des localités:", error);
		}
	};

	useEffect(() => {
		getCategoryOptions();
	}, [language]);

	return (
		dataLoaded && (
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={style.commonFormContainer}
			>
				{inputs.map((input) => {
					if (input.type === "select") {
						return (
							<div key={input.name} className={style.commonFormInputContainer}>
								<label htmlFor={input.name}>{input[`label_${language}`]}</label>
								<select
									{...register(input.name, {
										required: input.required.value,
									})}
								>
									{input.options?.map((option) => {
										return (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										);
									})}
								</select>

								{errors[input.name] && (
									<ErrorComponent
										message={input.required.message[language] as string}
									/>
								)}
							</div>
						);
					}
					if (input.type === "text") {
						return (
							<div key={input.name} className={style.commonFormInputContainer}>
								<label htmlFor={input.name}>{input[`label_${language}`]}</label>
								<input
									{...register(input.name, {
										required: input.required.value,
									})}
								/>

								{input.required.value && errors[input.name] && (
									<ErrorComponent message={input.required.message as string} />
								)}
							</div>
						);
					}
					if (input.type === "number") {
						return (
							<div key={input.name} className={style.commonFormInputContainer}>
								<label htmlFor={input.name}>{input[`label_${language}`]}</label>
								<input
									type="number"
									{...register(input.name, {
										required: input.required.value,
									})}
								/>

								{input.required.value && errors[input.name] && (
									<ErrorComponent message={input.required.message as string} />
								)}
							</div>
						);
					}
				})}

				<button type="submit">
					Suivant <ChevronRight />
				</button>
			</form>
		)
	);
};

export default CommonForm;
