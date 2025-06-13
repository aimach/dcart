// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import ErrorComponent from "../../errorComponent/ErrorComponent";
import FormTitleComponent from "../common/FormTitleComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
import PointSetUploadForm from "../../mapForm/pointSetUploadForm/PointSetUploadForm";
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
} from "../../../../utils/functions/toast";
import { getShapeForLayerName } from "../../../../utils/functions/icons";
import { updatePointSet } from "../../../../utils/api/builtMap/putRequests";
import { removeLang2Inputs } from "../../../../utils/functions/storymap";
// import des types
import type { FormEventHandler } from "react";
import type {
	MapColorType,
	MapIconType,
	PointSetType,
} from "../../../../utils/types/mapTypes";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./mapForms.module.scss";
// import des icônes
import { ChevronLeft, CircleHelp, CirclePlus, Pen, X } from "lucide-react";
import { point } from "leaflet";

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
				setStep(2);
			}
		}
	};

	const handleSubmitPointSet: FormEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault();
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
			setInputs(newInputs);
		}
	}, [storymapInfos]);

	return (
		<>
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
											{input[`label_${language}`]}
										</label>
									</div>
									<div className={style.inputContainer}>
										<input
											{...register(input.name as keyof simpleMapInputsType, {
												required: input.required.value,
											})}
										/>
									</div>

									{input.required.value &&
										errors[input.name as keyof simpleMapInputsType] && (
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
						<div className={style.headerContainer}>
							<ButtonComponent
								type="button"
								color="brown"
								textContent={translation[language].button.add}
								onClickFunction={() =>
									setIsAlreadyAPointSet(!isAlreadyAPointSet)
								}
								icon={<CirclePlus />}
								isSelected={true}
							/>

							<div className={style.helpContainer}>
								<a
									href="https://regular-twilight-01d.notion.site/Pr-parer-le-CSV-importer-1bd4457ff831806f9291d5a75cfbcbb9?pvs=4"
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
						</div>
					)}

					{!isAlreadyAPointSet && (
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
					)}
					{block?.attestations && (
						<>
							<table className={style.pointSetTable}>
								<thead>
									<tr>
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
										<th scope="col" />
									</tr>
								</thead>
								<tbody>
									{block.attestations.map((pointSet) => {
										const icon = getShapeForLayerName(
											(pointSet.icon as MapIconType)?.name_en,
											(pointSet.color as MapColorType)?.code_hex,
										);
										return (
											<tr key={pointSet.id} className={style.pointSetTableRow}>
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
