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
import { notifyUploadSuccess } from "../../../../utils/functions/toast";
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/map";
import { getAllColors, getAllIcons } from "../../../../utils/api/builtMap/getRequests";
// import des types
import type {
	blockType,
} from "../../../../utils/types/formTypes";
import type { ParseResult } from "papaparse";
import type { ChangeEvent } from "react";
import type { MapColorType, MapIconType, ParsedPointType, PointSetType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./mapForms.module.scss";
// import des icônes
import { ChevronLeft, CircleHelp } from "lucide-react";

export type stepInputsType = {
	content1_lang1: string;
	content1_lang2: string;
	content2_lang1: string;
	content2_lang2: string;
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
	const { block, updateFormType, reload, setReload } = useBuilderStore(
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

	// récupération de l'action à effectuer (création ou édition de la step)
	const stepAction = searchParams.get("stepAction");

	// récupération de l'id de la step
	const stepId = searchParams.get("id");

	// gestion de l'upload du fichier csv
	const [pointSet, setPointSet] = useState<PointSetType | null>(
		stepAction === "edit" && block?.attestations?.[0]?.attestationIds
			? { attestationIds: block.attestations[0].attestationIds } as PointSetType
			: null
	);
	const handleFileUpload = (event: ChangeEvent) => {
		// définition de la correspondance avec les headers du csv
		const headerMapping: Record<string, string> = {
			ID: "id",
		};

		const file = (event.target as HTMLInputElement).files?.[0];
		// si le fichier existe bien, il est parsé et les points sont stockés dans un état
		if (file) {
			// @ts-ignore : l'erreur de type sur File, le fichier est bien de type File (problème de typage avec l'utilisation de l'option skipFirstNLines)
			parse(file, {
				header: true,
				transformHeader: (header) => headerMapping[header] || header,
				skipEmptyLines: true,
				skipFirstNLines: 2,
				dynamicTyping: true, // permet d'avoir les chiffres et booléens en tant que tels
				complete: (result: ParseResult<ParsedPointType>) => {
					const allAttestationsIds = getAllAttestationsIdsFromParsedPoints(
						result.data,
					);
					setPointSet({ ...pointSet, attestationIds: allAttestationsIds as string } as PointSetType);
					notifyUploadSuccess("Points");
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
			if (stepAction === "create") {
				let pointSetWithName = pointSet;
				if (pointSet) {
					pointSetWithName = {
						...pointSet,
						name: data.content1_lang1
					}
					// création du bloc de la carte
					await uploadParsedPointsForSimpleMap(
						data as blockType,
						pointSet.name ? pointSet : pointSetWithName,
						storymapId as string,
						"step",
						stepAction as string,
						parentBlockId,
					);
				}
			} else if (stepAction === "edit" && pointSet) {
				// mise à jour du bloc de la carte
				await uploadParsedPointsForSimpleMap(
					data as blockType,
					pointSet,
					storymapId as string,
					"step",
					stepAction as string,
					parentBlockId,
				);
			}
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
					content1_lang1: "",
					content1_lang2: "",
					content2_lang1: "",
					content2_lang2: "",
				};
		// NB : ne fonctionne pas juste avec {}
		reset(defaultValues);
	}, [stepAction, stepId, reset]);


	const [allIcons, setAllIcons] = useState<MapIconType[]>([]);
	const [allColors, setAllColors] = useState<MapColorType[]>([]);
	useEffect(() => {
		const fetchAllIcons = async () => {
			const fetchedIcons = await getAllIcons();
			setAllIcons(fetchedIcons);
		};
		const fetchAllColors = async () => {
			const fetchedColors = await getAllColors();
			setAllColors(fetchedColors);
		}
		fetchAllIcons();
		fetchAllColors();
	}, []);

	console.log(block)

	useEffect(() => {
		if (!block) return;
		if (stepAction === "edit" && block?.attestations) {
			const defaultPointSet = block?.attestations[0];
			setPointSet({
				...pointSet,
				attestationIds: defaultPointSet.attestationIds,
				color: defaultPointSet.color?.id,
				icon: defaultPointSet.icon?.id,
			} as PointSetType);
		}
	}, [stepAction, block]);


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
				<div className={style.mapFormUploadInputContainer}>
					<div className={style.labelContainer}>
						<label htmlFor="colorId">
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointIcon.label
							}
						</label>
						<p>
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointIcon.description
							}
						</p>
					</div>
					<select
						name="colorId"
						id="colorId"
						value={pointSet ? pointSet.color as string : "0"}
						onChange={(event) =>
							setPointSet({
								...pointSet,
								color: event.target.value,
							} as PointSetType)
						}
					>
						<option value="null">
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.chooseColor
							}
						</option>
						{allColors.map((color) => (
							<option key={color.id} value={color.id}>
								{color[`name_${language}`]}
							</option>
						))}
					</select>
				</div>
				<div className={style.commonFormInputContainer}>
					<div className={style.labelContainer}>
						<label htmlFor="iconId">
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointIcon.label
							}
						</label>
						<p>
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointIcon.description
							}
						</p>
					</div>
					<div className={style.inputContainer}>
						<select
							name="iconId"
							id="iconId"
							value={pointSet ? pointSet.icon as string : "0"}
							onChange={(event) =>
								setPointSet({
									...pointSet,
									icon: event.target.value,
								} as PointSetType)
							}
						>
							<option value="null">
								{
									translation[language].backoffice.mapFormPage.pointSetForm
										.chooseIcon
								}
							</option>
							{allIcons.map((icon) =>
							(
								<option key={icon.id} value={icon.id}>
									{icon[`name_${language}`]}
								</option>
							)
							)}
						</select>
					</div>
				</div>
				<div className={style.formButtonNavigation}>
					<button
						type="button"
						onClick={() => {
							updateFormType("scroll_map");
							setSearchParams({ action: "edit" });
						}}
					>
						<ChevronLeft />
						{translation[language].common.back}
					</button>
					<button type="submit">
						{stepAction === "create"
							? translation[language].backoffice.storymapFormPage.form.addStep
							: translation[language].backoffice.storymapFormPage.form
								.modifyStep}
					</button>
				</div>
			</form>
		</>
	);
};

export default StepForm;
