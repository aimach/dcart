// import des bibliothèques
import { useEffect, useState } from "react";
import { parse } from "papaparse";
import { useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import ErrorComponent from "../../errorComponent/ErrorComponent";
import FormTitleComponent from "../common/FormTitleComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { stepInputs } from "../../../../utils/forms/storymapInputArray";
import { uploadParsedPointsForSimpleMap } from "../../../../utils/api/storymap/postRequests";
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

export type stepInputsType = {
	content1_fr: string;
	content1_en: string;
	content2_fr: string;
	content2_en: string;
};

interface StepFormProps {
	parentBlockId: string;
}

/**
 * Formulaire pour la création d'un bloc de type "step"
 */
const StepForm = ({ parentBlockId }: StepFormProps) => {
	// on récupère la langue
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { block, reload, setReload } = useBuilderStore(
		useShallow((state) => ({
			block: state.block,
			reload: state.reload,
			setReload: state.setReload,
		})),
	);

	// récupération de l'id de la storymap
	const { storymapId } = useParams();

	// récupération des paramètres de l'url
	const [searchParams, setSearchParams] = useSearchParams();

	// récupération de l'action à effectuer (création ou édition de la step)
	const stepAction = searchParams.get("stepAction");

	// récupération de l'id de la step
	const stepId = searchParams.get("id");

	// gestion de l'upload du fichier csv
	const [parsedPoints, setParsedPoints] = useState<parsedPointType[]>([]);
	const handleFileUpload = (event: ChangeEvent) => {
		// définition de la correspondance avec les headers du csv
		const headerMapping: Record<string, string> = {
			Région: "great_region",
			"Sous-région": "sub_region",
			Lieu: "location",
			Latitude: "latitude",
			Longitude: "longitude",
			"Extrait avec restitution": "extraction",
			Translittération: "transliteration",
			Traductions: "translation_fr",
		};

		const file = (event.target as HTMLInputElement).files?.[0];
		// si le fichier existe bien, il est parsé et les points sont stockés dans un état
		if (file) {
			parse(file, {
				header: true,
				transformHeader: (header) => headerMapping[header] || header,
				skipEmptyLines: true,
				dynamicTyping: true, // permet d'avoir les chiffres et booléens en tant que tels
				complete: (result: ParseResult<parsedPointType>) => {
					setParsedPoints(result.data);
				},
				error: (error) => {
					console.error("Erreur lors de la lecture du fichier :", error);
				},
			});
		}
	};

	// fonction appelée lors de la soumission du formulaire
	const handlePointSubmit = async (data: stepInputsType) => {
		try {
			await uploadParsedPointsForSimpleMap(
				data as blockType,
				parsedPoints,
				storymapId as string,
				"step",
				stepAction as string,
				parentBlockId,
			);
			// réinitialisation des variables
			reset(); // réinitialisation du formulaire
			setSearchParams({ stepAction: "create" });
			setReload(!reload);
		} catch (error) {
			console.error("Erreur lors de l'envoi du fichier :", error);
		}
	};

	// récupération des fonctions de gestion du formulaire
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<stepInputsType>({ defaultValues: {} });

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const defaultValues =
			stepAction === "edit"
				? (block as stepInputsType)
				: {
						content1_fr: "",
						content1_en: "",
						content2_fr: "",
						content2_en: "",
					};
		// NB : ne fonctionne pas juste avec {}
		reset(defaultValues);
	}, [stepAction, stepId, reset]);

	return (
		<>
			<FormTitleComponent action={stepAction as string} translationKey="step" />
			<form
				onSubmit={handleSubmit(handlePointSubmit)}
				className={style.mapFormContainer}
				key={stepAction}
			>
				{stepInputs.map((input) => {
					return (
						<div key={input.name} className={style.mapFormInputContainer}>
							<label htmlFor={input.name}>{input[`label_${language}`]}</label>
							<input
								{...register(input.name as keyof stepInputsType, {
									required: input.required.value,
								})}
							/>

							{input.required.value &&
								errors[input.name as keyof stepInputsType] && (
									<ErrorComponent
										message={input.required.message?.[language] as string}
									/>
								)}
						</div>
					);
				})}
				<div className={style.mapFormUploadInputContainer}>
					<label htmlFor="points">
						{translation[language].backoffice.storymapFormPage.form.csv}
					</label>
					<input
						id="point"
						type="file"
						accept=".csv"
						onChange={handleFileUpload}
					/>
				</div>
				<button type="submit">
					{stepAction === "create"
						? "Ajouter cette étape"
						: "Modifier cette étape"}
				</button>
			</form>
		</>
	);
};

export default StepForm;
