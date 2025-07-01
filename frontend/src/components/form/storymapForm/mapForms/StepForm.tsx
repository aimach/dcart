// import des bibliothèques
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
// import des composants
import ErrorComponent from "../../errorComponent/ErrorComponent";
import FormTitleComponent from "../common/FormTitleComponent";
import SelectOptionsComponent from "../../../common/input/SelectOptionsComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
import EditorComponent from "../wysiwygBlock/EditorComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
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
import type {
	allInputsType,
	blockType,
} from "../../../../utils/types/formTypes";
import type { ChangeEvent } from "react";
import type {
	MapColorType,
	MapIconType,
	PointSetType,
} from "../../../../utils/types/mapTypes";
import type Quill from "quill";
import type {
	BlockContentType,
	StorymapType,
} from "../../../../utils/types/storymapTypes";
import {
	addLangageBetweenBrackets,
	removeLang2Inputs,
} from "../../../../utils/functions/storymap";
// import du style
import style from "./mapForms.module.scss";
// import des icônes
import { ChevronLeft, CircleCheck, CircleHelp } from "lucide-react";
import { notifyError } from "../../../../utils/functions/toast";

export type stepInputsType = {
	content1_lang1: string;
	content1_lang2: string;
	content2_lang1: string;
	content2_lang2: string;
};

interface StepFormProps {
	scrollMapContent: BlockContentType;
}

/**
 * Formulaire pour la création d'un bloc de type "step"
 */
const StepForm = ({ scrollMapContent }: StepFormProps) => {
	// on récupère la langue
	const { translation, language } = useTranslation();

	const { icons, colors } = useContext(IconOptionsContext);

	// récupération des données des stores
	const {
		storymapInfos,
		block,
		updateBlockContent,
		updateFormType,
		reload,
		setReload,
	} = useBuilderStore(useShallow((state) => state));

	// récupération de l'id de la storymap
	const { storymapId } = useParams();

	// récupération des paramètres de l'url
	const [searchParams, setSearchParams] = useSearchParams();

	// récupération de l'action à effectuer (création ou édition de la step)
	const stepAction = searchParams.get("stepAction");

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
				if (result.data.length === 0) {
					notifyError("Le fichier est vide ou mal formaté");
					return;
				}
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

	// récupération des fonctions de gestion du formulaire
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
		setValue,
	} = useForm<stepInputsType>({ defaultValues: {} });

	// fonction appelée lors de la soumission du formulaire
	const handlePointSubmit = async (data: stepInputsType) => {
		try {
			// il faut vérifier que la description est bien remplie (lang2 si la storymap est en 2 langues)
			if (!pointSet || pointSet.attestationIds === "") {
				notifyError(
					"Veuillez sélectionner un fichier CSV avant de soumettre le formulaire.",
				);
				return;
			}
			if (
				!data.content2_lang1?.includes("<p>") ||
				(storymapInfos?.lang2 && !data.content2_lang2?.includes("<p>"))
			) {
				notifyError(
					"Veuillez remplir tous les champs obligatoires du formulaire.",
				);
				return;
			}

			if (stepAction === "create") {
				let pointSetWithName = pointSet;
				if (pointSet) {
					pointSetWithName = {
						...pointSet,
						name_fr: data.content1_lang1,
						name_en: data.content1_lang2,
					};
					// création du bloc de la carte
					await uploadParsedPointsForSimpleMap(
						data as blockType,
						pointSet[`name_${language}`] ? pointSet : pointSetWithName,
						storymapId as string,
						"step",
						stepAction as string,
						scrollMapContent.id as string,
					);
					reset();
					updateBlockContent(scrollMapContent);
				}
			} else if (stepAction === "edit" && pointSet) {
				const pointSetWithName = {
					...pointSet,
					name_fr: data.content1_lang1,
					name_en: data.content1_lang2,
				};
				// mise à jour du bloc de la carte
				await uploadParsedPointsForSimpleMap(
					data as blockType,
					pointSet.name_en ? pointSet : pointSetWithName,
					storymapId as string,
					"step",
					stepAction as string,
					scrollMapContent.id as string,
				);
				updateBlockContent(scrollMapContent);
				reset();
			}
			// réinitialisation du formulaire
			setPointSet(null);
			setValue("content1_lang1", "");
			setValue("content1_lang2", "");
			setSearchParams({ stepAction: "create" });
			setReload(!reload);
			const windowElement = document.querySelector(
				'section[class*="storymapFormContent"]',
			);
			if (windowElement) {
				windowElement.scrollTo({
					top: 0,
					behavior: "smooth",
				});
			}
		} catch (error) {
			console.error("Erreur lors de l'envoi du fichier :", error);
		}
	};

	useEffect(() => {
		if (stepAction === "edit") {
			reset(block as BlockContentType);
		} else if (stepAction === "create") {
			setValue("content1_lang1", "");
			setValue("content1_lang2", "");
		}
	}, [stepAction, reset, block]);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
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
				color: (defaultPointSet?.color as MapColorType)?.id,
				icon: (defaultPointSet?.icon as MapIconType)?.id,
				name_fr: defaultPointSet?.[`name_${language}`],
			} as PointSetType);
		}
	}, [stepAction, block]);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const quillRef = useRef<Quill | null>(null);

	const [inputs, setInputs] = useState(stepInputs);
	useEffect(() => {
		let newInputs = stepInputs;
		if (!storymapInfos?.lang2) {
			newInputs = removeLang2Inputs(stepInputs);
		}
		const newInputsWithLangInLabel = addLangageBetweenBrackets(
			newInputs,
			storymapInfos as StorymapType,
		);
		setInputs(newInputsWithLangInLabel);
	}, [storymapInfos]);

	return (
		<section key={reload.toString()}>
			{/* Utilisation de reload pour forcer le reset des wysiwyg */}
			<FormTitleComponent action={stepAction as string} translationKey="step" />
			<form
				onSubmit={handleSubmit(handlePointSubmit)}
				className={style.mapFormContainer}
				key={stepAction}
			>
				{inputs.map((input) => {
					if (input.type === "text") {
						return (
							<div key={input.name} className={style.mapFormInputContainer}>
								<LabelComponent
									htmlFor={input.name}
									label={input[`label_${language}`]}
									description={input[`description_${language}`] ?? ""}
								/>
								<div className={style.inputContainer}>
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
							</div>
						);
					}
					if (input.type === "wysiwyg") {
						return (
							<div key={input.name} className={style.mapFormInputContainer}>
								<LabelComponent
									htmlFor={input.name}
									label={input[`label_${language}`]}
									description={input[`description_${language}`] ?? ""}
								/>
								<div className={style.inputContainer}>
									<Controller
										name={input.name as keyof allInputsType}
										control={control}
										render={({ field: { onChange } }) => (
											<EditorComponent
												key={block?.id}
												ref={quillRef}
												onChange={onChange}
												defaultValue={
													block && block.type.name !== "scroll_map"
														? (block[
																`${input.name}` as keyof typeof block
															] as string)
														: null
												}
											/>
										)}
									/>
									{input.required.value &&
										errors[input.name as keyof allInputsType] && (
											<ErrorComponent
												message={input.required.message?.[language] as string}
											/>
										)}
								</div>
							</div>
						);
					}
				})}
				<div className={style.helpContainer}>
					<a
						href="https://regular-twilight-01d.notion.site/Pr-parer-le-CSV-importer-1bd4457ff831806f9291d5a75cfbcbb9"
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
						htmlFor="colorId"
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
						isRequired={false}
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
					<ButtonComponent
						type="button"
						onClickFunction={() => {
							updateFormType("scroll_map");
							setSearchParams({ action: "edit" });
						}}
						color="brown"
						textContent={translation[language].common.back}
						icon={<ChevronLeft />}
					/>
					<ButtonComponent
						type="submit"
						color="brown"
						textContent={
							stepAction === "create"
								? translation[language].backoffice.storymapFormPage.form.addStep
								: translation[language].backoffice.storymapFormPage.form
										.modifyStep
						}
					/>
				</div>
			</form>
		</section>
	);
};

export default StepForm;
