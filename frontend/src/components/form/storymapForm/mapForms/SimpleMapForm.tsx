// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import ErrorComponent from "../../errorComponent/ErrorComponent";
import FormTitleComponent from "../common/FormTitleComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
import PointSetUploadForm from "../../mapForm/pointSetUploadForm/PointSetUploadForm";
import TooltipComponent from "../../../common/tooltip/TooltipComponent";
import ModalComponent from "../../../common/modal/ModalComponent";
import UpdatePointSetContent from "../../../common/modal/UpdatePointSetContent";
// import du context
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import {
	createBlock,
	updateBlock,
} from "../../../../utils/api/storymap/postRequests";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { simpleMapInputs } from "../../../../utils/forms/storymapInputArray";
import { useShallow } from "zustand/shallow";
import { createPointSet } from "../../../../utils/api/builtMap/postRequests";
import { deletePointSet } from "../../../../utils/api/builtMap/deleteRequests";
import { getBlockInfos } from "../../../../utils/api/storymap/getRequests";
import {
	notifyCreateSuccess,
	notifyDeleteSuccess,
	notifyEditSuccess,
	notifyError,
} from "../../../../utils/functions/toast";
import { getShapeForLayerName } from "../../../../utils/functions/icons";
import {
	updatePointSet,
	updatePointSetPosition,
} from "../../../../utils/api/builtMap/putRequests";
import {
	addLangageBetweenBrackets,
	removeLang2Inputs,
} from "../../../../utils/functions/storymap";
import { handleCSVDownload } from "../../../../utils/functions/csv";
import { displayBrushCleaningButton } from "../../../../utils/functions/common";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import des types
import type { FormEventHandler } from "react";
import type {
	MapColorType,
	MapIconType,
	PointSetType,
} from "../../../../utils/types/mapTypes";
import type {
	BlockContentType,
	StorymapType,
} from "../../../../utils/types/storymapTypes";
// import du style
import style from "./mapForms.module.scss";
// import des icônes
import {
	ChevronLeft,
	CircleHelp,
	CirclePlus,
	FileDown,
	Pen,
	X,
} from "lucide-react";

export type simpleMapInputsType = {
	content1_lang1: string;
	content1_lang2: string;
	content2_lang1: string;
};

/**
 * Formulaire pour la création d'un bloc de type "simple_map"
 */
const SimpleMapForm = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	const { hasGrayScale } = useMapStore();

	const {
		storymapInfos,
		updateFormType,
		block,
		updateBlockContent,
		reload,
		setReload,
	} = useBuilderStore(useShallow((state) => state));

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action") as "create" | "edit";
	const { storymapId } = useParams();

	const [step, setStep] = useState(1);

	// gestion de l'upload du fichier csv
	const [pointSet, setPointSet] = useState<PointSetType | null>(null);
	const [isAlreadyAPointSet, setIsAlreadyAPointSet] = useState(false);

	const [pointSetIdToClean, setPointSetIdToClean] = useState<string | null>(
		null,
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [pointType, setPointType] = useState<"bdd" | "custom">("bdd");

	useEffect(() => {
		if (block?.attestations) {
			setIsAlreadyAPointSet(true);
		}
	}, [block?.attestations]);

	useEffect(() => {
		if (action === "edit") {
			setValue("content1_lang1", block?.content1_lang1 as string);
			setValue("content1_lang2", block?.content1_lang2 as string);
		}
	}, [action, block]);

	const [pointSetFormAction, setPointSetFormAction] = useState<
		"create" | "edit"
	>("create");

	// fonction appelée lors de la soumission du formulaire
	const handleMapFormSubmit = async (data: simpleMapInputsType) => {
		if (action === "create") {
			// création du bloc de la carte
			const newBlockInfos = await createBlock({
				...data,
				storymapId,
				typeName: "simple_map",
			});
			if (newBlockInfos?.id) {
				setReload(!reload);
				updateBlockContent(newBlockInfos);
				setStep(2);
			}
		}
		if (action === "edit") {
			// mise à jour du bloc de la carte
			const updatedBlockInfos = await updateBlock(
				{
					...data,
					storymapId,
					typeName: "simple_map",
				},
				(block as BlockContentType).id,
			);

			if (updatedBlockInfos?.id) {
				notifyEditSuccess("Carte simple", true);
				setStep(2);
			}
		}
	};

	const isPointSetFormValidWith1Lang =
		pointSet &&
		typeof pointSet.name_fr === "string" &&
		pointSet.name_fr.trim() !== "";

	const isPointSetFormValidWith2Langs =
		pointSet &&
		typeof pointSet.name_fr === "string" &&
		pointSet.name_fr.trim() !== "" &&
		typeof pointSet.name_en === "string" &&
		pointSet.name_en.trim() !== "";

	const atLeastOneFileLoaded =
		(!pointSet?.attestationIds &&
			pointSet?.customPointsArray &&
			pointSet?.customPointsArray?.length > 0) ||
		(pointSet?.attestationIds && !pointSet?.customPointsArray) ||
		(pointSet?.attestationIds &&
			pointSet?.customPointsArray &&
			pointSet?.customPointsArray.length === 0) ||
		(pointSet?.attestationIds &&
			pointSet?.customPointsArray &&
			pointSet?.customPointsArray.length > 0);

	const handleSubmitPointSet: FormEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault();
		if (!atLeastOneFileLoaded) {
			notifyError(
				"Veuillez charger au moins un fichier de points avant de soumettre le formulaire.",
			);
			return;
		}
		if (
			(storymapInfos?.lang2 && !isPointSetFormValidWith2Langs) ||
			!isPointSetFormValidWith1Lang
		) {
			notifyError(
				"Veuillez remplir tous les champs obligatoires du formulaire.",
			);
			return;
		}
		let pointSetData = pointSet as PointSetType;
		if (!pointSet?.name_en)
			pointSetData = {
				...pointSetData,
				name_en: pointSet?.name_fr,
			} as PointSetType;
		if (pointSetFormAction === "create") {
			const newPointSet = await createPointSet(pointSetData as PointSetType);
			if (newPointSet?.status === 201) {
				setIsAlreadyAPointSet(true);
				const newBlockInfos = await getBlockInfos(block?.id as string);
				updateBlockContent(newBlockInfos);
				notifyCreateSuccess("Jeu de points", false);
				setPointSet(null);
			}
		}
		if (pointSetFormAction === "edit") {
			const newPointSet = await updatePointSet(pointSetData as PointSetType);
			if (newPointSet?.status === 200) {
				const newBlockInfos = await getBlockInfos(block?.id as string);
				updateBlockContent(newBlockInfos);
				notifyEditSuccess("Jeu de points", false);
				setPointSet(null);
			}
		}
	};

	// récupération des fonctions de gestion du formulaire
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<simpleMapInputsType>({
		defaultValues: block as simpleMapInputsType,
	});

	const handleDeletePointSet = async (pointSetId: string) => {
		await deletePointSet(pointSetId as string);
		const newBlockInfos = await getBlockInfos(block?.id as string);
		updateBlockContent(newBlockInfos);
		notifyDeleteSuccess("Jeu de points", false);
	};

	const handleUpdatePointSet = async (pointSetId: string) => {
		const pointSetToUpdate = block?.attestations?.find(
			(pointSet) => pointSet.id === pointSetId,
		) as PointSetType;
		if (pointSetToUpdate) {
			setPointSetFormAction("edit");
			setPointSet({
				...pointSetToUpdate,
				blockId: block?.id as string,
				icon: (pointSetToUpdate.icon as MapIconType).id,
				color: (pointSetToUpdate.color as MapColorType).id,
			});
			setIsAlreadyAPointSet(false);
		}
	};

	const [inputs, setInputs] = useState(simpleMapInputs);
	useEffect(() => {
		if (!storymapInfos?.lang2) {
			const newInputs = removeLang2Inputs(simpleMapInputs);
			const newInputsWithLangInLabel = addLangageBetweenBrackets(
				newInputs,
				storymapInfos as StorymapType,
			);
			setInputs(newInputsWithLangInLabel);
		}
	}, [storymapInfos]);

	const [positionOptions, setPositionOptions] = useState<number[]>([]);
	useEffect(() => {
		if (block?.attestations) {
			const positions = block.attestations.map((pointSet) => pointSet.position);
			const sortedPositions = positions.sort((a, b) => a - b);
			setPositionOptions(sortedPositions);
		}
	}, [block?.attestations]);

	const handlePointSetPosition = async (
		pointSetId: string,
		newPosition: string,
	) => {
		const response = await updatePointSetPosition(
			pointSetId,
			newPosition,
			block?.id as string,
			"block",
		);
		if (response?.status === 200) {
			const newBlockInfos = await getBlockInfos(block?.id as string);
			updateBlockContent(newBlockInfos);
			notifyEditSuccess("Position du jeu de points", true);
		}
	};

	return (
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
				translationKey="simple_map"
			/>
			{step === 1 && (
				<form
					onSubmit={handleSubmit(handleMapFormSubmit)}
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
											{...register(input.name as keyof simpleMapInputsType, {
												required: input.required.value,
											})}
										/>
										{input.required.value &&
											errors[input.name as keyof simpleMapInputsType] && (
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
											{...register(input.name as keyof simpleMapInputsType, {
												required: input.required.value,
											})}
										>
											{input.options?.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</div>
									{errors[input.name as keyof simpleMapInputsType] && (
										<ErrorComponent
											message={input.required.message?.[language] as string}
										/>
									)}
								</div>
							);
						}
					})}
					<div className={style.formButtonNavigation}>
						<ButtonComponent
							type="button"
							onClickFunction={() => {
								updateFormType("blockChoice");
								setSearchParams(undefined);
							}}
							color="brown"
							textContent={translation[language].common.back}
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

						{block?.id && (
							<ButtonComponent
								type="button"
								color="brown"
								onClickFunction={() => setStep(2)}
								textContent="Aller au jeux de points"
							/>
						)}
					</div>
				</form>
			)}
			{step === 2 && (
				<>
					{isAlreadyAPointSet && (
						<>
							<div className={style.headerContainer}>
								<ButtonComponent
									type="button"
									color="brown"
									textContent={
										translation[language].backoffice.mapFormPage.addMapPoints
									}
									onClickFunction={() =>
										setIsAlreadyAPointSet(!isAlreadyAPointSet)
									}
									icon={<CirclePlus />}
									isSelected={true}
								/>
							</div>
							<div className={style.helpContainer}>
								<a
									href="https://sharedocs.huma-num.fr/wl/?id=dJrDrFA2uDDRqqo5PGnmnkNzaNpFWSEW&fmode=open"
									target="_blank"
									rel="noreferrer"
								>
									<CircleHelp color="grey" />
									{
										translation[language].backoffice.mapFormPage
											.uploadPointsHelp
									}
								</a>
							</div>
						</>
					)}
					{!isAlreadyAPointSet && (
						<>
							<div className={style.helpContainer}>
								<a
									href="https://sharedocs.huma-num.fr/wl/?id=dJrDrFA2uDDRqqo5PGnmnkNzaNpFWSEW&fmode=open"
									target="_blank"
									rel="noreferrer"
								>
									<CircleHelp color="grey" />
									{
										translation[language].backoffice.mapFormPage
											.uploadPointsHelp
									}
								</a>
							</div>
							<PointSetUploadForm
								pointSet={pointSet}
								setPointSet={setPointSet}
								handleSubmit={handleSubmitPointSet}
								parentId={block?.id as string}
								type="block"
								action={pointSetFormAction}
								cancelFunction={() => {
									setPointSet(null);
									setIsAlreadyAPointSet(true);
									setPointSetFormAction("create");
								}}
							/>
						</>
					)}
					{block?.attestations && (
						<>
							<table className={style.pointSetTable}>
								<thead>
									<tr>
										<th scope="col">Position</th>
										<th scope="col">
											{`${
												translation[language].backoffice.mapFormPage
													.pointSetTable.nameLang1
											} (${storymapInfos?.lang1?.name.toUpperCase()})`}
										</th>
										{storymapInfos?.lang2 && (
											<th scope="col">
												{`${
													translation[language].backoffice.mapFormPage
														.pointSetTable.nameLang2
												} (${storymapInfos?.lang2?.name.toUpperCase()})`}
											</th>
										)}
										<th scope="col">
											{
												translation[language].backoffice.mapFormPage
													.pointSetTable.icon
											}
										</th>
										<th>
											{
												translation[language].backoffice.mapFormPage
													.pointSetTable.downloadBDDCSV
											}
										</th>
										<th>
											{
												translation[language].backoffice.mapFormPage
													.pointSetTable.downloadCustomCSV
											}
										</th>
										<th>
											{
												translation[language].backoffice.mapFormPage
													.pointSetTable.lastActivity
											}
										</th>
										<th scope="col" />
									</tr>
								</thead>
								<tbody>
									{block.attestations
										.sort((a, b) => a.position - b.position)
										.map((pointSet) => {
											const icon = getShapeForLayerName(
												(pointSet.icon as MapIconType)?.name_en,
												(pointSet.color as MapColorType)?.code_hex,
												hasGrayScale,
											);
											const isCustomPointSet =
												pointSet.customPointsArray &&
												pointSet.customPointsArray.length > 0;
											const isBDDPointSet =
												pointSet.attestationIds &&
												pointSet.attestationIds !== "";
											return (
												<tr
													key={pointSet.id}
													className={style.pointSetTableRow}
												>
													<td>
														{/* Sélecteur de position */}
														<select
															name="position"
															id="position"
															onChange={(event) => {
																handlePointSetPosition(
																	pointSet.id as string,
																	event.target.value,
																);
															}}
															value={pointSet.position}
														>
															{positionOptions.map((position) => (
																<option key={position} value={position}>
																	{position}
																</option>
															))}
														</select>
													</td>

													<td>{pointSet.name_fr}</td>
													{storymapInfos?.lang2 && <td>{pointSet.name_en}</td>}
													<td>
														<p
															// biome-ignore lint/security/noDangerouslySetInnerHtml: le HTML est généré par le code
															dangerouslySetInnerHTML={{
																__html: icon,
															}}
														/>
													</td>
													<td>
														<TooltipComponent
															text={
																translation[language].backoffice.mapFormPage
																	.pointSetTable.downloadCSV
															}
														>
															{isBDDPointSet ? (
																<FileDown
																	onClick={() =>
																		handleCSVDownload(
																			pointSet,
																			`${pointSet.name_fr}-bdd.csv`,
																			"mapPoints",
																		)
																	}
																	cursor={"pointer"}
																/>
															) : (
																<FileDown
																	color="#a1afc4"
																	cursor={"not-allowed"}
																/>
															)}
														</TooltipComponent>
														<TooltipComponent
															text={translation[language].button.clean}
														>
															{displayBrushCleaningButton(
																pointSet.id as string,
																!isBDDPointSet,
																setPointSetIdToClean,
																setIsModalOpen,
																setPointType,
																"bdd",
															)}
														</TooltipComponent>
													</td>
													<td>
														<TooltipComponent
															text={
																translation[language].backoffice.mapFormPage
																	.pointSetTable.downloadCSV
															}
														>
															{isCustomPointSet ? (
																<FileDown
																	onClick={() =>
																		handleCSVDownload(
																			pointSet,
																			`${pointSet.name_fr}-custom.csv`,
																			"customPoints",
																		)
																	}
																	cursor={"pointer"}
																/>
															) : (
																<FileDown
																	color="#a1afc4"
																	cursor={"not-allowed"}
																/>
															)}
														</TooltipComponent>
														<TooltipComponent
															text={translation[language].button.clean}
														>
															{displayBrushCleaningButton(
																pointSet.id as string,
																!isCustomPointSet,
																setPointSetIdToClean,
																setIsModalOpen,
																setPointType,
																"custom",
															)}
														</TooltipComponent>
													</td>
													<td>
														{pointSet.lastActivity
															? new Date(
																	pointSet.lastActivity,
																).toLocaleDateString(language, {
																	year: "numeric",
																	month: "long",
																	day: "numeric",
																})
															: null}
													</td>
													<td>
														<Pen
															onClick={() =>
																handleUpdatePointSet(pointSet.id as string)
															}
															onKeyDown={() =>
																handleUpdatePointSet(pointSet.id as string)
															}
														/>
														<X
															onClick={() =>
																handleDeletePointSet(pointSet.id as string)
															}
															onKeyDown={() =>
																handleDeletePointSet(pointSet.id as string)
															}
															color="#9d2121"
														/>
													</td>
												</tr>
											);
										})}
								</tbody>
							</table>
							<ButtonComponent
								type="button"
								color="brown"
								textContent={translation[language].common.back}
								onClickFunction={() => {
									setStep(1);
								}}
								isSelected={true}
							/>
						</>
					)}
				</>
			)}
		</>
	);
};

export default SimpleMapForm;
