// import des bibliothèques
import { useState } from "react";
import { parse } from "papaparse";
import { useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import ErrorComponent from "../../errorComponent/ErrorComponent";
import FormTitleComponent from "../common/FormTitleComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation"; // import des services
import { comparisonMapInputs } from "../../../../utils/forms/storymapInputArray";
import { uploadParsedPointsForComparisonMap } from "../../../../utils/api/storymap/postRequests";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useShallow } from "zustand/shallow";
// import des types
import type {
	blockType,
	parsedPointType,
} from "../../../../utils/types/formTypes";
import type { ParseResult } from "papaparse";
import type { ChangeEvent } from "react";
// import du style
import style from "./mapForms.module.scss";
// import des icônes
import { ChevronRight } from "lucide-react";

export type comparisonMapInputsType = {
	content1_fr: string;
	content1_en: string;
	content2_fr: string;
	content2_en: string;
};

/**
 * Formulaire pour la création d'un bloc de type "comparison_map"
 */
const ComparisonMapForm = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { updateFormType, block, reload, setReload } = useBuilderStore(
		useShallow((state) => ({
			block: state.block,
			updateFormType: state.updateFormType,
			reload: state.reload,
			setReload: state.setReload,
		})),
	);

	// récupération de l'id de la storymap
	const { storymapId } = useParams();

	// récupération des paramètres de l'url
	const [searchParams, setSearchParams] = useSearchParams();

	// récupération de l'action à effectuer (création ou édition)
	const action = searchParams.get("action");

	// gestion de l'upload du fichier csv
	const [parsedPoints, setParsedPoints] = useState<{
		[key: string]: parsedPointType[];
	}>({ left: [], right: [] });
	const handleFileUpload = (event: ChangeEvent) => {
		// définition de la correspondance avec les headers du csv
		const headerMapping: { [key: string]: string } = {
			Région: "great_region",
			"Sous-région": "sub_region",
			Site: "site",
			Latitude: "latitude",
			Longitude: "longitude",
			"Extrait avec restitution": "extraction",
			Translittération: "transliteration",
			Traductions: "translation_fr",
		};

		const file = (event.target as HTMLInputElement).files?.[0];
		// récupération de l'index de l'input (left ou right)
		const index = (event.target as HTMLInputElement).id;
		// si le fichier existe bien, il est parsé et les points sont stockés dans un état
		if (file) {
			parse(file, {
				header: true,
				transformHeader: (header) => headerMapping[header] || header,
				skipEmptyLines: true,
				dynamicTyping: true, // permet d'avoir les chiffres et booléens en tant que tels
				complete: (result: ParseResult<parsedPointType>) => {
					setParsedPoints({ ...parsedPoints, [index]: result.data });
				},
				error: (error) => {
					console.error("Erreur lors de la lecture du fichier :", error);
				},
			});
		}
	};

	// fonction appelée lors de la soumission du formulaire
	const handlePointSubmit = async (data: comparisonMapInputsType) => {
		await uploadParsedPointsForComparisonMap(
			data as blockType,
			parsedPoints,
			storymapId as string,
			"comparison_map",
			action as string,
		);
		// réinitialisation du choix du formulaire
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	// récupération des fonctions de gestion du formulaire
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<comparisonMapInputsType>({
		defaultValues: block as comparisonMapInputsType,
	});

	return (
		<>
			<FormTitleComponent
				action={action as string}
				translationKey="comparison_map"
			/>
			<form
				onSubmit={handleSubmit(handlePointSubmit)}
				className={style.mapFormContainer}
			>
				{comparisonMapInputs.map((input) => {
					if (input.type === "text") {
						return (
							<div key={input.name} className={style.mapFormInputContainer}>
								<label htmlFor={input.name}>{input[`label_${language}`]}</label>
								<input
									{...register(input.name as keyof comparisonMapInputsType, {
										required: input.required.value,
									})}
								/>

								{errors[input.name as keyof comparisonMapInputsType] && (
									<ErrorComponent
										message={input.required.message?.[language] as string}
									/>
								)}
							</div>
						);
					}
					if (input.type === "select") {
						return (
							<div key={input.name} className={style.mapFormInputContainer}>
								<label htmlFor={input.name}>{input[`label_${language}`]}</label>
								<select
									{...register(input.name as keyof comparisonMapInputsType, {
										required: input.required.value,
									})}
								>
									{input.options?.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>

								{errors[input.name as keyof comparisonMapInputsType] && (
									<ErrorComponent
										message={input.required.message?.[language] as string}
									/>
								)}
							</div>
						);
					}
				})}
				<div className={style.mapFormUploadInputContainer}>
					<label htmlFor="left">
						{translation[language].backoffice.storymapFormPage.form.csv}{" "}
						{
							translation[language].backoffice.storymapFormPage.form.forLeftPane
						}{" "}
					</label>
					<input
						id="left"
						type="file"
						accept=".csv"
						onChange={handleFileUpload}
					/>
				</div>
				<div className={style.mapFormUploadInputContainer}>
					<label htmlFor="right">
						{translation[language].backoffice.storymapFormPage.form.csv}{" "}
						{
							translation[language].backoffice.storymapFormPage.form
								.forRightPane
						}
					</label>
					<input
						id="right"
						type="file"
						accept=".csv"
						onChange={handleFileUpload}
					/>
				</div>
				<button
					type="submit"
					disabled={!parsedPoints.left && !parsedPoints.right}
				>
					Suivant
					<ChevronRight />
				</button>
			</form>
		</>
	);
};

export default ComparisonMapForm;
