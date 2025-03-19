// import des bibliothèques
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
// import des composants
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";
import ErrorComponent from "../../errorComponent/ErrorComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { getAllCategories } from "../../../../utils/api/builtMap/getRequests";
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { FieldErrors, SubmitHandler } from "react-hook-form";
import type { InputType } from "../../../../utils/types/formTypes";
import type { OptionType } from "../../../../utils/types/commonTypes";
import type {
	CategoryType,
	MapInfoType,
} from "../../../../utils/types/mapTypes";
import type { TranslationType } from "../../../../utils/types/languageTypes";
import type Quill from "quill";
// import du style
import style from "./introForm.module.scss";
import EditorComponent from "../../storymapForm/wysiwygBlock/EditorComponent";

type IntroFormProps = {
	inputs: InputType[];
};

/**
 * Formulaire de la première étape de création : informations générales (titre, description, catégorie)
 * @param inputs la liste des inputs du formulaire
 * @returns ErrorComponent | NavigationButtonComponent
 */
const IntroForm = ({ inputs }: IntroFormProps) => {
	// récupération des données de la langue
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { mapInfos, setMapInfos, step, incrementStep } = useMapFormStore(
		useShallow((state) => state),
	);

	// définition d'un état pour savoir si les données sont chargées
	const [dataLoaded, setDataLoaded] = useState(false);

	// définition de la fonction de soumission du formulaire (ajout des données au store et passage à l'étape suivante)
	const onSubmit: SubmitHandler<MapInfoType> = (data) => {
		setMapInfos({ ...mapInfos, ...data });
		incrementStep(step);
	};

	// import des services du formulaire
	const {
		control,
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<MapInfoType>({
		defaultValues: mapInfos ?? {},
	});

	// à chaque changement dans les inputs, mise à jour du store avec les informations des inputs
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const subscription = watch((value) => {
			setMapInfos(value as MapInfoType);
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	// au montage du composant, et si le language change, récupération des catégories pour le select/options
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const getCategoryOptions = async () => {
			const allCategories = await getAllCategories();
			const formatedCategoryOptions: OptionType[] = allCategories.map(
				(category: CategoryType) => ({
					value: category.id,
					label: category[`name_${language}`],
				}),
			);

			for (const input of inputs) {
				if (input.name === "category") {
					input.options = formatedCategoryOptions;
				}
			}
			setDataLoaded(true);
		};
		getCategoryOptions();
	}, [language]);

	const quillRef = useRef<Quill | null>(null);

	return (
		dataLoaded && (
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={style.commonFormContainer}
			>
				<h4>{translation[language].backoffice.mapFormPage.addMapIntro}</h4>
				{inputs.map((input) => {
					if (input.type === "select") {
						return (
							<div key={input.name} className={style.commonFormInputContainer}>
								<label htmlFor={input.name}>{input[`label_${language}`]}</label>
								<select
									{...register(input.name as keyof MapInfoType, {
										required: input.required.value,
									})}
									value={
										mapInfos
											? ((
													mapInfos[
														input.name as keyof MapInfoType
													] as CategoryType
												).id as string)
											: ""
									}
								>
									{input.options?.map((option) => {
										return (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										);
									})}
								</select>

								{errors[input.name as keyof FieldErrors<MapInfoType>] && (
									<ErrorComponent
										message={
											input.required.message?.[
												language as keyof TranslationType
											] as string
										}
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
									{...register(input.name as keyof MapInfoType, {
										required: input.required.value,
									})}
								/>

								{input.required.value &&
									errors[input.name as keyof FieldErrors<MapInfoType>] && (
										<ErrorComponent
											message={
												input.required.message?.[
													language as keyof TranslationType
												] as string
											}
										/>
									)}
							</div>
						);
					}
					if (input.type === "wysiwyg") {
						return (
							<div key={input.name} className={style.commonFormInputContainer}>
								<label htmlFor={input.name}>{input[`label_${language}`]}</label>
								<Controller
									name={input.name as keyof InputType}
									control={control}
									render={({ field: { onChange } }) => (
										<EditorComponent
											ref={quillRef}
											onChange={onChange}
											defaultValue={
												(mapInfos as MapInfoType)
													? (mapInfos as MapInfoType)[
															`${input.name}` as keyof typeof mapInfos
														]
													: null
											}
										/>
									)}
								/>
								{input.required.value &&
									errors[input.name as keyof InputType] && (
										<ErrorComponent
											message={input.required.message?.[language] as string}
										/>
									)}
							</div>
						);
					}
				})}
				<NavigationButtonComponent step={step} nextButtonDisplayed={true} />
			</form>
		)
	);
};

export default IntroForm;
