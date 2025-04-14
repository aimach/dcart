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
import {
	notifyError,
} from "../../../../utils/functions/toast";
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/map";
// import des types
import type {
	blockType,
} from "../../../../utils/types/formTypes";
import type { ParseResult } from "papaparse";
import type { ChangeEvent } from "react";
import type { ParsedPointType, PointSetType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./mapForms.module.scss";
// import des icônes
import { ChevronLeft, CircleHelp } from "lucide-react";

export type comparisonMapInputsType = {
	content1_lang1: string;
	content1_lang2: string;
	content2_lang1: string;
	content2_lang2: string;
};

/**
 * Formulaire pour la création d'un bloc de type "comparison_map"
 */
const ComparisonMapForm = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	const { updateFormType, block, reload, setReload } = useBuilderStore(
		useShallow((state) => ({
			block: state.block,
			updateFormType: state.updateFormType,
			reload: state.reload,
			setReload: state.setReload,
		})),
	);

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");

	const { storymapId } = useParams();

	// gestion de l'upload du fichier csv
	const [pointSets, setPointsSets] = useState<
		Record<string, PointSetType | null>
	>({
		left: null,
		right: null,
	});
	const handleFileUpload = (event: ChangeEvent) => {
		// définition de la correspondance avec les headers du csv
		const headerMapping: Record<string, string> = {
			ID: "id",
		};

		const file = (event.target as HTMLInputElement).files?.[0];
		// récupération de l'index de l'input (left ou right)
		const panelSide = (event.target as HTMLInputElement).id;
		// si le fichier existe bien, il est parsé et les points sont stockés dans un état
		if (file) {
			// @ts-ignore : l'erreur de type sur File, le fichier est bien de type File (problème de typage avec l'utilisation de l'option skipFirstNLines)
			parse(file, {
				header: true,
				transformHeader: (header) => headerMapping[header] || header,
				skipEmptyLines: true,
				dynamicTyping: true, // option qui permet d'avoir les chiffres et booléens en tant que tels
				skipFirstNLines: 2,
				complete: (result: ParseResult<ParsedPointType>) => {
					// récupération des ids des attestations
					const allAttestationsIds = getAllAttestationsIdsFromParsedPoints(
						result.data,
					);
					setPointsSets({
						...pointSets,
						[panelSide]: {
							name: panelSide,
							attestationIds: allAttestationsIds,
						}
					});
				},
				error: () => {
					notifyError("Erreur lors de la lecture du fichier :");
				},
			});
		}
	};


	// fonction appelée lors de la soumission du formulaire
	const handlePointSubmit = async (data: comparisonMapInputsType) => {
		await uploadParsedPointsForComparisonMap(
			data as blockType,
			pointSets as Record<string, PointSetType>,
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
				<div className={style.helpContainer}>
					<a
						href="https://regular-twilight-01d.notion.site/Pr-parer-le-CSV-importer-storymaps-carte-simple-1bd4457ff83180d3ab96f4b50bc0800b?pvs=4"
						target="_blank"
						rel="noreferrer"
					>
						<CircleHelp color="grey" />
						{translation[language].backoffice.mapFormPage.uploadPointsHelp}
					</a>
				</div>
				<div className={style.formButtonNavigation}>
					<button
						type="button"
						onClick={() => {
							updateFormType("blockChoice");
							setSearchParams(undefined);
						}}
					>
						<ChevronLeft />
						{translation[language].common.back}
					</button>
					<button
						type="submit"
						disabled={
							action === "create" &&
							(pointSets.left?.attestationIds.length === 0 ||
								pointSets.right?.attestationIds.length === 0)
						}
					>
						{action === "create"
							? translation[language].backoffice.storymapFormPage.form.create
							: translation[language].backoffice.storymapFormPage.form.edit}
					</button>
				</div>
			</form>
		</>
	);
};

export default ComparisonMapForm;
