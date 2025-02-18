// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import des composants
import ErrorComponent from "../../errorComponent/ErrorComponent";
// import du context
import { TranslationContext } from "../../../../context/TranslationContext";
// import des services
import { getAllCategories } from "../../../../utils/loaders/loaders";
import { useMapFormStore } from "../../../../utils/stores/mapFormStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { SubmitHandler } from "react-hook-form";
import type { InputType } from "../../../../utils/types/formTypes";
import type { OptionType } from "../../../../utils/types/commonTypes";
import type {
	CategoryType,
	MapInfoType,
} from "../../../../utils/types/mapTypes";
// import du style
import style from "./demoCommonForm.module.scss";
// import des icônes
import { ChevronRight } from "lucide-react";

type allInputsType = any;

type DemoCommonFormProps = {
	inputs: InputType[];
	defaultValues: any | undefined;
};

const DemoCommonForm = ({ inputs, defaultValues }: DemoCommonFormProps) => {
	// on récupère la langue
	const { language } = useContext(TranslationContext);

	// on prépare un state pour le chargement des données
	const [dataLoaded, setDataLoaded] = useState(false);

	// on récupère les données du formulaire
	const { mapInfos, setMapInfos, step, incrementStep, decrementStep } =
		useMapFormStore(useShallow((state) => state));

	// on gère le formulaire
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<allInputsType>({
		defaultValues: mapInfos ?? {},
	});

	// on initie le chargement du visuel
	const loadVisualContent = (values: MapInfoType) => {
		setMapInfos({ ...mapInfos, ...values });
	};

	// on initie la soumission du formulaire
	const onSubmit: SubmitHandler<allInputsType> = () => {
		incrementStep(step);
	};

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
									<ErrorComponent
										message={input.required.message[language] as string}
									/>
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
									<ErrorComponent
										message={input.required.message[language] as string}
									/>
								)}
							</div>
						);
					}
				})}
				<button
					type="button"
					onClick={() => loadVisualContent(getValues())}
					onKeyUp={() => loadVisualContent(getValues())}
				>
					Charger le visuel
				</button>
				{step > 1 && (
					<button
						type="button"
						onClick={() => decrementStep(step)}
						onKeyUp={() => decrementStep(step)}
					>
						Précédent
					</button>
				)}

				<button type="submit">
					Suivant <ChevronRight />
				</button>
			</form>
		)
	);
};

export default DemoCommonForm;
