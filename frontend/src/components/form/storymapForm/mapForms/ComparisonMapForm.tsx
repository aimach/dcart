// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import ErrorComponent from "../../errorComponent/ErrorComponent";
import FormTitleComponent from "../common/FormTitleComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
import SelectOptionsComponent from "../../../common/input/SelectOptionsComponent";
// import du contexte
import { IconOptionsContext } from "../../../../context/IconOptionsContext";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation"; // import des services
import { comparisonMapInputs } from "../../../../utils/forms/storymapInputArray";
import { uploadParsedPointsForComparisonMap } from "../../../../utils/api/storymap/postRequests";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useShallow } from "zustand/shallow";
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/map";
import { parseCSVFile } from "../../../../utils/functions/csv";
// import des types
import type { blockType } from "../../../../utils/types/formTypes";
import type { ChangeEvent } from "react";
import type {
	MapColorType,
	MapIconType,
	PointSetType,
} from "../../../../utils/types/mapTypes";
// import du style
import style from "./mapForms.module.scss";
// import des icônes
import { ChevronLeft, CircleCheck, CircleHelp } from "lucide-react";

export type comparisonMapInputsType = {
	content1_lang1: string;
	content1_lang2: string;
	content2_lang1: string;
	content2_lang2: string;
	leftColorId?: string;
	leftIconId?: string;
	rightColorId?: string;
	rightIconId?: string;
};

/**
 * Formulaire pour la création d'un bloc de type "comparison_map"
 */
const ComparisonMapForm = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	const { icons, colors } = useContext(IconOptionsContext);

	const { updateFormType, block, reload, setReload } = useBuilderStore(
		useShallow((state) => ({
			block: state.block,
			updateFormType: state.updateFormType,
			reload: state.reload,
			setReload: state.setReload,
		})),
	);

	const [formSide, setFormSide] = useState("left");

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");

	const { storymapId } = useParams();

	// gestion de l'upload du fichier csv
	const [pointSets, setPointsSets] = useState<Record<string, PointSetType>>({
		left: {
			color: "0",
			icon: "0",
			name: "",
			attestationIds: "",
		},
		right: {
			color: "0",
			icon: "0",
			name: "",
			attestationIds: "",
		},
	});

	const handleFileUpload = (event: ChangeEvent) => {
		parseCSVFile({
			event,
			onComplete: (result, panelSide = "") => {
				const allAttestationsIds = getAllAttestationsIdsFromParsedPoints(
					result.data,
				);
				setPointsSets((prev) => ({
					...prev,
					[panelSide]: {
						...prev[panelSide],
						name: panelSide,
						attestationIds: allAttestationsIds,
					},
				}));
				setSelectedFiles((prev) => ({
					...prev,
					[panelSide]: (event.target as HTMLInputElement).files?.[0] as File,
				}));
			},
		});
	};

	const [isLoaded, setIsLoaded] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const leftPointsSet = block?.attestations?.find(
			(pointSet) => pointSet.name === "left",
		);
		const rightPointsSet = block?.attestations?.find(
			(pointSet) => pointSet.name === "right",
		);

		setPointsSets({
			left: {
				...pointSets.left,
				color: (leftPointsSet?.color as MapColorType)?.id,
				icon: (leftPointsSet?.icon as MapIconType)?.id,
				attestationIds: leftPointsSet?.attestationIds as string,
				name: "left",
			},
			right: {
				...pointSets.right,
				color: (rightPointsSet?.color as MapColorType)?.id,
				icon: (rightPointsSet?.icon as MapIconType)?.id,
				attestationIds: rightPointsSet?.attestationIds as string,
				name: "right",
			},
		});

		setIsLoaded(true);
	}, [block]);

	useEffect(() => {
		if (action === "edit") {
			setValue("content1_lang1", block?.content1_lang1 as string);
			setValue("content1_lang2", block?.content1_lang2 as string);
		}
	}, [action, block]);

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
		setValue,
		formState: { errors },
	} = useForm<comparisonMapInputsType>({
		defaultValues: block as comparisonMapInputsType,
	});

	const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({
		left: new File([], ""),
		right: new File([], ""),
	});

	return (
		isLoaded && (
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
									<div className={style.labelContainer}>
										<label htmlFor={input.name}>
											{input[`label_${language}`]}
										</label>
									</div>
									<div className={style.inputContainer}>
										<input
											{...register(
												input.name as keyof comparisonMapInputsType,
												{
													required: input.required.value,
												},
											)}
										/>
									</div>

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
									<div className={style.labelContainer}>
										<label htmlFor={input.name}>
											{input[`label_${language}`]}
										</label>
									</div>
									<div className={style.inputContainer}>
										<select
											{...register(
												input.name as keyof comparisonMapInputsType,
												{
													required: input.required.value,
												},
											)}
										>
											{input.options?.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</div>
									{errors[input.name as keyof comparisonMapInputsType] && (
										<ErrorComponent
											message={input.required.message?.[language] as string}
										/>
									)}
								</div>
							);
						}
					})}
					<div>
						<ButtonComponent
							color="brown"
							type="button"
							onClickFunction={() => setFormSide("left")}
							textContent="côté gauche"
							isSelected={formSide === "left"}
						/>
						<ButtonComponent
							color="brown"
							type="button"
							onClickFunction={() => setFormSide("right")}
							textContent="côté droit"
							isSelected={formSide === "right"}
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
						<div className={style.mapFormInputContainer}>
							<LabelComponent
								htmlFor={formSide}
								label={`${translation[language].backoffice.storymapFormPage.form.csv} ${
									translation[language].backoffice.storymapFormPage.form[
										formSide === "left" ? "forLeftPane" : "forRightPane"
									]
								}`}
								description=""
							/>
							<div className={style.inputContainer}>
								<input
									id={formSide}
									key={formSide}
									type="file"
									accept=".csv"
									onChange={handleFileUpload}
								/>
								<p
									style={{ display: "flex", alignItems: "center", gap: "5px" }}
								>
									{((action === "create" &&
										selectedFiles[formSide].name !== "") ||
										action === "edit") && <CircleCheck color="green" />}
									{action === "create" &&
										selectedFiles[formSide].name !== "" &&
										`Fichier chargé : ${selectedFiles[formSide].name}`}
									{action === "edit" &&
										selectedFiles[formSide].name === "" &&
										"Un fichier est déjà chargé"}
									{action === "edit" &&
										selectedFiles[formSide].name !== "" &&
										`Nouveau fichier chargé : ${selectedFiles[formSide].name}`}
								</p>
							</div>
						</div>
						<div className={style.mapFormInputContainer}>
							<LabelComponent
								htmlFor={`${formSide}ColorId`}
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
									selectId={`${formSide}ColorId`}
									basicOptionValue="null"
									basicOptionContent={
										translation[language].backoffice.mapFormPage.pointSetForm
											.chooseColor
									}
									options={colors}
									onChangeFunction={(event) =>
										setPointsSets({
											...pointSets,
											[formSide]: {
												...pointSets[formSide],
												color: event.target.value,
											},
										})
									}
									value={pointSets[formSide].color as string}
								/>
							</div>
						</div>
						<div className={style.mapFormInputContainer}>
							<LabelComponent
								htmlFor={`${formSide}IconId`}
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
									selectId={`${formSide}IconId`}
									basicOptionValue="null"
									basicOptionContent={
										translation[language].backoffice.mapFormPage.pointSetForm
											.chooseIcon
									}
									options={icons}
									onChangeFunction={(event) =>
										setPointsSets({
											...pointSets,
											[formSide]: {
												...pointSets[formSide],
												icon: event.target.value,
											},
										})
									}
									value={pointSets[formSide].icon as string}
								/>
							</div>
						</div>
					</div>

					<div className={style.formButtonNavigation}>
						<ButtonComponent
							type="button"
							color="brown"
							textContent={translation[language].common.back}
							onClickFunction={() => {
								updateFormType("blockChoice");
								setSearchParams(undefined);
							}}
							icon={<ChevronLeft />}
						/>
						<ButtonComponent
							type="submit"
							color="brown"
							textContent={
								action === "create"
									? translation[language].backoffice.storymapFormPage.form
											.create
									: translation[language].backoffice.storymapFormPage.form.edit
							}
							isDisabled={
								(action === "create" && !pointSets.left?.attestationIds) ||
								!pointSets.right?.attestationIds
							}
						/>
					</div>
				</form>
			</>
		)
	);
};

export default ComparisonMapForm;
