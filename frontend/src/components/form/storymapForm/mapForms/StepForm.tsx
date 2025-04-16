// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import ErrorComponent from "../../errorComponent/ErrorComponent";
import FormTitleComponent from "../common/FormTitleComponent";
import SelectOptionsComponent from "../../../common/input/SelectOptionsComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
// import du contexte
import { IconOptionsContext } from "../../../../context/IconOptionsContext";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { stepInputs } from "../../../../utils/forms/storymapInputArray";
import { uploadParsedPointsForSimpleMap } from "../../../../utils/api/storymap/postRequests";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useShallow } from "zustand/shallow";
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/map";
import { parseCSVFile } from "../../../../utils/functions/csv";
// import des types
import type { blockType } from "../../../../utils/types/formTypes";
import type { ChangeEvent } from "react";
import type { PointSetType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./mapForms.module.scss";
// import des icônes
import { ChevronLeft, CircleCheck, CircleHelp } from "lucide-react";

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

	const { icons, colors } = useContext(IconOptionsContext);

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
			? ({
					attestationIds: block.attestations[0].attestationIds,
				} as PointSetType)
			: null,
	);
	const handleFileUpload = (event: ChangeEvent) => {
		parseCSVFile({
			event,
			onComplete: (result) => {
				const allAttestationsIds = getAllAttestationsIdsFromParsedPoints(
					result.data,
				);
				setPointSet({
					...pointSet,
					attestationIds: allAttestationsIds as string,
				} as PointSetType);
				setSelectedFile((event.target as HTMLInputElement).files?.[0] ?? null);
			},
		});
	};

	// fonction appelée lors de la soumission du formulaire
	const handlePointSubmit = async (data: stepInputsType) => {
		try {
			if (stepAction === "create") {
				let pointSetWithName = pointSet;
				if (pointSet) {
					pointSetWithName = {
						...pointSet,
						name: data.content1_lang1,
					};
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

	useEffect(() => {
		if (!block) {
			setPointSet({
				...pointSet,
				attestationIds: "",
				name: "",
				color: "",
				icon: "",
			} as PointSetType);
		}
		if (stepAction === "edit" && block?.attestations) {
			const defaultPointSet = block?.attestations[0];
			setPointSet({
				...pointSet,
				attestationIds: defaultPointSet?.attestationIds,
				color: defaultPointSet?.color?.id,
				icon: defaultPointSet?.icon?.id,
				name: defaultPointSet?.name,
			} as PointSetType);
		}
	}, [stepAction, block]);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
							<div className={style.labelContainer}>
								<label htmlFor={input.name}>{input[`label_${language}`]}</label>
							</div>
							<div className={style.inputContainer}>
								<input
									{...register(input.name as keyof stepInputsType, {
										required: input.required.value,
									})}
								/>
							</div>

							{input.required.value &&
								errors[input.name as keyof stepInputsType] && (
									<ErrorComponent
										message={input.required.message?.[language] as string}
									/>
								)}
						</div>
					);
				})}
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
				<div className={style.mapFormInputContainer}>
					<LabelComponent
						htmlFor="points"
						label={translation[language].backoffice.storymapFormPage.form.csv}
						description=""
					/>
					<div className={style.inputContainer}>
						<input
							id="point"
							type="file"
							accept=".csv"
							onChange={handleFileUpload}
						/>
						{stepAction === "edit" && (
							<p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
								<CircleCheck color="green" />
								{selectedFile === null
									? "Un fichier est déjà chargé"
									: `Nouveau fichier chargé : ${selectedFile.name}`}
							</p>
						)}
					</div>
				</div>
				<div className={style.mapFormInputContainer}>
					<LabelComponent
						htmlFor="name"
						label={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointSetName.label
						}
						description={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointSetName.description
						}
					/>
					<div className={style.inputContainer}>
						<input
							id="name"
							name="name"
							type="text"
							onChange={(event) =>
								setPointSet({
									...pointSet,
									name: event.target.value,
								} as PointSetType)
							}
							value={(pointSet?.name as string) ?? ""}
						/>
					</div>
				</div>
				<div className={style.mapFormInputContainer}>
					<LabelComponent
						htmlFor="colorId"
						label={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointColor.label
						}
						description={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointColor.description
						}
					/>
					<div className={style.inputContainer}>
						<SelectOptionsComponent
							selectId="colorId"
							basicOptionValue="null"
							basicOptionContent={
								translation[language].backoffice.mapFormPage.pointSetForm
									.chooseColor
							}
							options={colors}
							onChangeFunction={(event) =>
								setPointSet({
									...pointSet,
									color: event.target.value,
								} as PointSetType)
							}
							value={(pointSet?.color as string) ?? "null"}
						/>
					</div>
				</div>
				<div className={style.mapFormInputContainer}>
					<LabelComponent
						htmlFor="iconId"
						label={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointIcon.label
						}
						description={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointIcon.description
						}
					/>
					<div className={style.inputContainer}>
						<SelectOptionsComponent
							selectId="iconId"
							basicOptionValue="null"
							basicOptionContent={
								translation[language].backoffice.mapFormPage.pointSetForm
									.chooseIcon
							}
							options={icons}
							onChangeFunction={(event) =>
								setPointSet({
									...pointSet,
									icon: event.target.value,
								} as PointSetType)
							}
							value={(pointSet?.icon as string) ?? "null"}
						/>
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
