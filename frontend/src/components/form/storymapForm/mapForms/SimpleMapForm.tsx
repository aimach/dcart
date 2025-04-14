// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import ErrorComponent from "../../errorComponent/ErrorComponent";
import FormTitleComponent from "../common/FormTitleComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
// import du context
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { createBlock, updateBlock } from "../../../../utils/api/storymap/postRequests";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { simpleMapInputs } from "../../../../utils/forms/storymapInputArray";
import { useShallow } from "zustand/shallow";
import { createPointSet } from "../../../../utils/api/builtMap/postRequests";
import PointSetUploadForm from "../../mapForm/pointSetUploadForm/PointSetUploadForm";
import { deletePointSet } from "../../../../utils/api/builtMap/deleteRequests";
// import des types
import type { FormEventHandler } from "react";
// import du style
import style from "./mapForms.module.scss";
// import des icônes
import { ChevronLeft } from "lucide-react";
import {
	notifyCreateSuccess,
	notifyDeleteSuccess,
} from "../../../../utils/functions/toast";
import type { PointSetType } from "../../../../utils/types/mapTypes";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import des icônes
import { X } from "lucide-react";
import { getBlockInfos } from "../../../../utils/api/storymap/getRequests";


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

	const { updateFormType, block, updateBlockContent, reload, setReload } = useBuilderStore(
		useShallow((state) => ({
			block: state.block,
			updateFormType: state.updateFormType,
			reload: state.reload,
			setReload: state.setReload,
			updateBlockContent: state.updateBlockContent,
		})),
	);

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");
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
				setStep(2)
			}
		};
		if (action === "edit") {
			// mise à jour du bloc de la carte
			const updatedBlockInfos = await updateBlock({
				...data,
				storymapId,
				typeName: "simple_map",
			}, (block as BlockContentType).id);

			if (updatedBlockInfos?.id) {
				setStep(2);
			}
		}
	}


	const handleSubmitPointSet: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		const newPointSet = await createPointSet(pointSet as PointSetType);
		if (newPointSet?.status === 201) {
			setIsAlreadyAPointSet(true);
			const newBlockInfos = await getBlockInfos(block?.id as string);
			updateBlockContent(newBlockInfos);
			notifyCreateSuccess("Jeu de points", false);
		}
	};



	// récupération des fonctions de gestion du formulaire
	const {
		register,
		handleSubmit,
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
					{simpleMapInputs.map((input) => {
						if (input.type === "text") {
							return (
								<div key={input.name} className={style.mapFormInputContainer}>
									<label htmlFor={input.name}>{input[`label_${language}`]}</label>
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
							);
						}
						if (input.type === "select") {
							return (
								<div key={input.name} className={style.mapFormInputContainer}>
									<label htmlFor={input.name}>{input[`label_${language}`]}</label>
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
						<button type="submit">
							{action === "create"
								? translation[language].backoffice.storymapFormPage.form.create
								: translation[language].backoffice.storymapFormPage.form.edit}
						</button>
						{block?.id && (

							<button type="button" onClick={() => setStep(2)}>
								Aller aux jeux de points
							</button>
						)}
					</div>
				</form>
			)}
			{step === 2 && (
				<>
					{isAlreadyAPointSet && (
						<ButtonComponent
							type="button"
							color="brown"
							textContent="Ajouter un nouveau jeu de points"
							onClickFunction={() => setIsAlreadyAPointSet(!isAlreadyAPointSet)}
						/>
					)}

					{!isAlreadyAPointSet && (
						<PointSetUploadForm
							pointSet={pointSet}
							setPointSet={setPointSet}
							handleSubmit={handleSubmitPointSet}
							parentId={block?.id as string}
							type="block"
						/>
					)}
					{block?.attestations && (
						<table className={style.pointSetTable}>
							<thead>
								<tr>
									<th scope="col">
										{
											translation[language].backoffice.mapFormPage.pointSetTable
												.name
										}
									</th>
									<th scope="col">
										{
											translation[language].backoffice.mapFormPage.pointSetTable
												.color
										}
									</th>
									<th scope="col">
										{
											translation[language].backoffice.mapFormPage.pointSetTable
												.icon
										}
									</th>
									<th scope="col">
										{
											translation[language].backoffice.mapFormPage.pointSetTable
												.delete
										}
									</th>
								</tr>
							</thead>
							<tbody>
								{block.attestations.map((pointSet) => (
									<tr key={pointSet.id} className={style.pointSetTableRow}>
										<td>{pointSet.name}</td>
										<td>
											{pointSet.color ? <div style={{ backgroundColor: pointSet.color.code_hex, width: 30, height: 30 }} /> :
												translation[language].backoffice.mapFormPage.pointSetForm
													.noDefinedColor}
										</td>
										<td>
											{pointSet.icon
												? pointSet.icon[`name_${language}`]
												: translation[language].backoffice.mapFormPage
													.pointSetForm.noDefinedIcon}
										</td>
										<td>
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
								))}
							</tbody>
						</table>
					)
					}
				</>
			)}
		</>)
}

export default SimpleMapForm;
