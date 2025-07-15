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
import ModalComponent from "../../../common/modal/ModalComponent";
import UpdatePointSetContent from "../../../common/modal/UpdatePointSetContent";
import TooltipComponent from "../../../common/tooltip/TooltipComponent";
// import du contexte
import { IconOptionsContext } from "../../../../context/IconOptionsContext";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation"; // import des services
import { comparisonMapInputs } from "../../../../utils/forms/storymapInputArray";
import { uploadParsedPointsForComparisonMap } from "../../../../utils/api/storymap/postRequests";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useShallow } from "zustand/shallow";
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/map";
import {
	handleCSVDownload,
	parseCSVFile,
} from "../../../../utils/functions/csv";
import { notifyError } from "../../../../utils/functions/toast";
import { addLangageBetweenBrackets } from "../../../../utils/functions/storymap";
import { displayBrushCleaningButton } from "../../../../utils/functions/common";
// import des types
import type { blockType } from "../../../../utils/types/formTypes";
import type { ChangeEvent } from "react";
import type {
	CustomPointType,
	MapColorType,
	MapIconType,
	PointSetType,
} from "../../../../utils/types/mapTypes";
import type { StorymapType } from "../../../../utils/types/storymapTypes";
import type { ParseResult } from "papaparse";
// import du style
import style from "./mapForms.module.scss";
// import des icônes
import {
	ChevronLeft,
	CircleCheck,
	CircleHelp,
	CircleX,
	FileDown,
} from "lucide-react";

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

	const fileStatusTranslationObject =
		translation[language].backoffice.storymapFormPage.form.fileStatus;

	const { icons, colors } = useContext(IconOptionsContext);

	const { storymapInfos, updateFormType, block, reload, setReload } =
		useBuilderStore(useShallow((state) => state));

	const [formSide, setFormSide] = useState("left");

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");

	const { storymapId } = useParams();

	// gestion de l'upload du fichier csv
	const [pointSets, setPointsSets] = useState<Record<string, PointSetType>>({
		left: {
			color: "0",
			icon: "0",
			name_fr: "",
			name_en: "",
			attestationIds: "",
			customPointsArray: [],
		},
		right: {
			color: "0",
			icon: "0",
			name_fr: "",
			name_en: "",
			attestationIds: "",
			customPointsArray: [],
		},
	});

	const [pointSetIdToClean, setPointSetIdToClean] = useState<string | null>(
		null,
	);
	const [pointType, setPointType] = useState<"bdd" | "custom">("bdd");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleBDDPointFileUpload = (event: ChangeEvent) => {
		parseCSVFile({
			event,
			onComplete: (
				result: ParseResult<{ id: string } | CustomPointType>,
				panelSide = "",
			) => {
				if (result.data.length === 0) {
					notifyError("Le fichier est vide ou mal formaté");
					return;
				}
				const allAttestationsIds = getAllAttestationsIdsFromParsedPoints(
					result.data as { id: string }[],
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
					[panelSide]: {
						db: (event.target as HTMLInputElement).files?.[0] as File,
						custom: prev[panelSide].custom,
					},
				}));
			},
		});
	};

	const handleCustomPointFileUpload = (event: ChangeEvent) => {
		parseCSVFile({
			event,
			onComplete: (
				result: ParseResult<{ id: string } | CustomPointType>,
				panelSide = "",
			) => {
				setPointsSets((prev) => ({
					...prev,
					[panelSide]: {
						...prev[panelSide],
						name: panelSide,
						customPointsArray: result.data as CustomPointType[],
					},
				}));
				setSelectedFiles((prev) => ({
					...prev,
					[panelSide]: {
						db: prev[panelSide].db,
						custom: (event.target as HTMLInputElement).files?.[0] as File,
					},
				}));
			},
			onError: () => {
				notifyError(
					"Erreur lors du chargement du fichier. Vérifier le format.",
				);
			},
			headerMapping: {
				latitude: "latitude",
				longitude: "longitude",
				location: "location",
				sourceNb: "source_nb",
			},
			skipLines: 0,
		});
	};

	const [isLoaded, setIsLoaded] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const leftPointsSet = block?.attestations?.find(
			(pointSet) => pointSet[`name_${language}`] === "left",
		);
		const rightPointsSet = block?.attestations?.find(
			(pointSet) => pointSet[`name_${language}`] === "right",
		);

		setPointsSets({
			left: {
				...pointSets.left,
				id: leftPointsSet?.id,
				color: (leftPointsSet?.color as MapColorType)?.id,
				icon: (leftPointsSet?.icon as MapIconType)?.id,
				attestationIds: leftPointsSet?.attestationIds as string,
				name_fr: "left",
				customPointsArray: leftPointsSet?.customPointsArray || [],
			},
			right: {
				...pointSets.right,
				id: rightPointsSet?.id,
				color: (rightPointsSet?.color as MapColorType)?.id,
				icon: (rightPointsSet?.icon as MapIconType)?.id,
				attestationIds: rightPointsSet?.attestationIds as string,
				name_fr: "right",
				customPointsArray: rightPointsSet?.customPointsArray || [],
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

	const isAttestationButNoCustomPoints = (key: string) =>
		pointSets?.[key]?.attestationIds &&
		(!pointSets?.[key]?.customPointsArray ||
			pointSets?.[key]?.customPointsArray.length === 0);

	const isCustomPointsButNoAttestation = (key: string) =>
		!pointSets?.[key]?.attestationIds &&
		(pointSets?.[key]?.customPointsArray?.length ?? 0) > 0;

	const isAttestationAndCustomPoints = (key: string) =>
		pointSets?.[key]?.attestationIds &&
		pointSets?.[key]?.customPointsArray &&
		pointSets?.[key]?.customPointsArray.length > 0;

	const atLeastOneFileLoadedInLeftPanel =
		isAttestationAndCustomPoints("left") ||
		isCustomPointsButNoAttestation("left") ||
		isAttestationButNoCustomPoints("left");
	const atLeastOneFileLoadedInRightPanel =
		isAttestationAndCustomPoints("right") ||
		isCustomPointsButNoAttestation("right") ||
		isAttestationButNoCustomPoints("right");

	// fonction appelée lors de la soumission du formulaire
	const handlePointSubmit = async (data: comparisonMapInputsType) => {
		if (
			!data.content1_lang1 ||
			!data.content2_lang1 ||
			!atLeastOneFileLoadedInLeftPanel ||
			!atLeastOneFileLoadedInRightPanel
		) {
			notifyError(
				"Veuillez remplir tous les champs obligatoires du formulaire.",
			);
			return;
		}
		await uploadParsedPointsForComparisonMap(
			{ ...data, id: block?.id } as blockType,
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

	const [selectedFiles, setSelectedFiles] = useState<
		Record<string, { db: File | null; custom: File | null }>
	>({
		left: { db: null, custom: null },
		right: { db: null, custom: null },
	});

	const [inputs, setInputs] = useState(comparisonMapInputs);
	useEffect(() => {
		if (!storymapInfos?.lang2) {
			const newInputs = comparisonMapInputs.filter(
				(input) => input.name !== "content1_lang2",
			);
			const newInputsWithLangInLabel = addLangageBetweenBrackets(
				newInputs,
				storymapInfos as StorymapType,
			);
			setInputs(newInputsWithLangInLabel);
		}
	}, [storymapInfos]);

	return (
		isLoaded && (
			<>
				{isModalOpen && (
					<ModalComponent
						onClose={() => {
							setIsModalOpen(false);
						}}
					>
						<UpdatePointSetContent
							idToUpdate={pointSetIdToClean as string}
							setIsModalOpen={setIsModalOpen}
							reload={reload}
							setReload={setReload}
							mapType="storymap"
							pointType={pointType}
						/>
					</ModalComponent>
				)}
				<FormTitleComponent
					action={action as string}
					translationKey="comparison_map"
				/>
				<form
					onSubmit={handleSubmit(handlePointSubmit)}
					className={style.mapFormContainer}
				>
					{inputs.map((input) => {
						if (input.type === "text") {
							return (
								<div key={input.name} className={style.mapFormInputContainer}>
									<div className={style.labelContainer}>
										<label htmlFor={input.name}>
											{input[`label_${language}`]}{" "}
											{input.required.value && (
												<span style={{ color: "#9d2121" }}>*</span>
											)}
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
										{errors[input.name as keyof comparisonMapInputsType] && (
											<ErrorComponent
												message={input.required.message?.[language] as string}
											/>
										)}
									</div>
								</div>
							);
						}
						if (input.type === "select") {
							return (
								<div key={input.name} className={style.mapFormInputContainer}>
									<div className={style.labelContainer}>
										<label htmlFor={input.name}>
											{input[`label_${language}`]}{" "}
											{input.required.value && (
												<span style={{ color: "#9d2121" }}>*</span>
											)}
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
										{errors[input.name as keyof comparisonMapInputsType] && (
											<ErrorComponent
												message={input.required.message?.[language] as string}
											/>
										)}
									</div>
								</div>
							);
						}
					})}
					<div className={style.panelButtonContainer}>
						<ButtonComponent
							color="brown"
							type="button"
							onClickFunction={() => setFormSide("left")}
							textContent={translation[language].button.leftSide}
							isSelected={formSide === "left"}
						/>
						<ButtonComponent
							color="brown"
							type="button"
							onClickFunction={() => setFormSide("right")}
							textContent={translation[language].button.rightSide}
							isSelected={formSide === "right"}
						/>
					</div>
					<div className={style.helpContainer}>
						<a
							href="https://sharedocs.huma-num.fr/wl/?id=dJrDrFA2uDDRqqo5PGnmnkNzaNpFWSEW&fmode=open"
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
								label={`${translation[language].backoffice.mapFormPage.pointSetForm.attestationIds.label} ${
									translation[language].backoffice.storymapFormPage.form[
										formSide === "left" ? "forLeftPane" : "forRightPane"
									]
								}`}
								description={
									translation[language].backoffice.mapFormPage.pointSetForm
										.attestationIds.description
								}
								isRequired={false}
							/>
							<div className={style.inputContainer}>
								<input
									id={formSide}
									key={formSide}
									type="file"
									accept=".csv"
									onChange={handleBDDPointFileUpload}
								/>
								<div className={style.fileStatusAndDownloadContainer}>
									<p
										style={{
											display: "flex",
											alignItems: "center",
											gap: "5px",
										}}
									>
										{pointSets[formSide]?.attestationIds ? (
											<CircleCheck color="green" />
										) : action === "edit" ? (
											<CircleX color="grey" />
										) : null}
										{selectedFiles[formSide].db
											? `${fileStatusTranslationObject.loadedFile} : ${selectedFiles[formSide]?.db.name}`
											: pointSets[formSide]?.attestationIds
												? fileStatusTranslationObject.fileAlreadyLoaded
												: fileStatusTranslationObject.noFile}
									</p>
									{pointSets[formSide]?.attestationIds && (
										<div className={style.downloadAndCleanContainer}>
											<TooltipComponent
												text={
													translation[language].backoffice.mapFormPage
														.pointSetTable.downloadCSV
												}
											>
												<FileDown
													cursor={"pointer"}
													onClick={() =>
														handleCSVDownload(
															pointSets[formSide],
															`${block?.content1_lang1}-${formSide}-bdd.csv`,
															"mapPoints",
														)
													}
												/>
											</TooltipComponent>
											<TooltipComponent
												text={translation[language].button.clean}
											>
												{displayBrushCleaningButton(
													pointSets[formSide].id as string,
													false,
													setPointSetIdToClean,
													setIsModalOpen,
													setPointType,
													"bdd",
												)}
											</TooltipComponent>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className={style.mapFormInputContainer}>
							<LabelComponent
								htmlFor={formSide}
								label={`${translation[language].backoffice.mapFormPage.pointSetForm.customPointsFile.label} ${
									translation[language].backoffice.storymapFormPage.form[
										formSide === "left" ? "forLeftPane" : "forRightPane"
									]
								}`}
								description={
									translation[language].backoffice.mapFormPage.pointSetForm
										.customPointsFile.label
								}
								isRequired={false}
							/>
							<div className={style.inputContainer}>
								<input
									id={formSide}
									key={formSide}
									type="file"
									accept=".csv"
									onChange={handleCustomPointFileUpload}
								/>
								<div className={style.fileStatusAndDownloadContainer}>
									<p
										style={{
											display: "flex",
											alignItems: "center",
											gap: "5px",
										}}
									>
										{(pointSets[formSide]?.customPointsArray?.length ?? 0) >
										0 ? (
											<CircleCheck color="green" />
										) : action === "edit" ? (
											<CircleX color="grey" />
										) : null}
										{selectedFiles[formSide].custom
											? `${fileStatusTranslationObject.loadedFile} : ${selectedFiles[formSide]?.custom.name}`
											: (pointSets[formSide]?.customPointsArray?.length ?? 0) >
													0
												? fileStatusTranslationObject.fileAlreadyLoaded
												: fileStatusTranslationObject.noFile}
									</p>
									{(pointSets[formSide]?.customPointsArray?.length ?? 0) >
										0 && (
										<div className={style.downloadAndCleanContainer}>
											<TooltipComponent
												text={
													translation[language].backoffice.mapFormPage
														.pointSetTable.downloadCSV
												}
											>
												<FileDown
													cursor={"pointer"}
													onClick={() =>
														handleCSVDownload(
															pointSets[formSide],
															`${block?.content1_lang1}-${formSide}-custom.csv`,
															"customPoints",
														)
													}
												/>
											</TooltipComponent>
											<TooltipComponent
												text={translation[language].button.clean}
											>
												{displayBrushCleaningButton(
													pointSets[formSide].id as string,
													false,
													setPointSetIdToClean,
													setIsModalOpen,
													setPointType,
													"custom",
												)}
											</TooltipComponent>
										</div>
									)}
								</div>
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
								isRequired={false}
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
								isRequired={false}
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
						/>
					</div>
				</form>
			</>
		)
	);
};

export default ComparisonMapForm;
