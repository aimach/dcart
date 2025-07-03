// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { parse } from "papaparse";
import { useForm } from "react-hook-form";
// import des composants
import FormTitleComponent from "../common/FormTitleComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
import ErrorComponent from "../../errorComponent/ErrorComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { tableInputs } from "../../../../utils/forms/storymapInputArray";
import { useShallow } from "zustand/shallow";
import { createBlock } from "../../../../utils/api/storymap/postRequests";
import { updateBlock } from "../../../../utils/api/storymap/postRequests";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
	notifyError,
	notifyUploadSuccess,
} from "../../../../utils/functions/toast";
import {
	addLangageBetweenBrackets,
	removeLang2Inputs,
} from "../../../../utils/functions/storymap";
// import des types
import type { ChangeEvent } from "react";
import type {
	BlockContentType,
	StorymapType,
} from "../../../../utils/types/storymapTypes";
import type { ParseResult } from "papaparse";
// import du style
import style from "../mapForms/mapForms.module.scss";
// import des icônes
import {
	ChevronLeft,
	ChevronRight,
	CircleCheck,
	CircleHelp,
	CircleX,
} from "lucide-react";

export type tableInputsType = {
	content1_lang1: string;
	content1_lang2: string;
	content3: string;
};

/**
 * Formulaire pour la création d'un bloc de type "title"
 */
const TableForm = () => {
	const { translation, language } = useTranslation();

	const { storymapInfos, updateFormType, block, reload, setReload } =
		useBuilderStore(useShallow((state) => state));

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");

	const { storymapId } = useParams();

	// gestion de l'upload du fichier csv
	const [csvContentLang1, setCsvContentLang1] = useState<string[][]>([]);
	const [csvContentLang2, setCsvContentLang2] = useState<string[][]>([]);
	const handleFileUpload = (
		event: ChangeEvent<HTMLInputElement>,
		langNb: number,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const text = e.target?.result as string;
				const parsed = parse(text, {
					skipEmptyLines: true,
					complete: (result: ParseResult<string[]>) => {
						if (result.data.length === 0) {
							notifyError("Le fichier est vide ou mal formaté");
							return;
						}
						notifyUploadSuccess("Tableau");
					},
				});
				if (parsed.data) {
					if (langNb === 1) {
						setCsvContentLang1(parsed.data as string[][]);
						setSelectedFiles((prev) => ({ ...prev, lang1: file }));
					} else {
						setCsvContentLang2(parsed.data as string[][]);
						setSelectedFiles((prev) => ({ ...prev, lang2: file }));
					}
				}
			};
			reader.readAsText(file);
		}
	};

	// récupération des fonctions de gestion du formulaire
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<tableInputsType>({
		defaultValues: block as tableInputsType,
	});

	// fonction appelée lors de la soumission du formulaire
	const [selectedFiles, setSelectedFiles] = useState<
		Record<string, File | null>
	>({
		lang1: null,
		lang2: null,
	});

	const isLang2TableIsNotUploadedYet =
		block?.content2_lang2 === "[]" && csvContentLang2.length === 0;
	const pointAreUploaded = (array: string[][]) => array.length > 0;
	const fileAlreadyUploaded = (block: BlockContentType | null, key: string) => {
		if (block === null) return false;
		return block === null || block?.[key] !== "[]";
	};
	const isValidLang1 =
		pointAreUploaded(csvContentLang1) ||
		fileAlreadyUploaded(block, "content2_lang1"); // soit le csv est chargé, soit le fichier est déjà chargé
	const needLang2Csv = storymapInfos?.lang2;
	const isValidLang2 =
		!needLang2Csv ||
		pointAreUploaded(csvContentLang2) ||
		fileAlreadyUploaded(block, "content2_lang2"); // soit pas de langue 2, soit le csv est chargé, soit le fichier est déjà chargé (le champ n'est pas vide);

	const handlePointSubmit = async (data: tableInputsType) => {
		if (!isValidLang1) {
			notifyError("Le contenu du bloc tableau langue 1 est vide.");
			return;
		}
		if (!isValidLang2) {
			notifyError("Le contenu du bloc tableau langue 2 est vide.");
			return;
		}
		if (action === "create") {
			await createBlock({
				...data,
				content1_lang1: `${data.content1_lang1}`,
				content2_lang1: JSON.stringify(csvContentLang1),
				content2_lang2: JSON.stringify(csvContentLang2),
				content3: data.content3 ? data.content3 : "top",
				storymapId: storymapId,
				typeName: "table",
			});
			notifyCreateSuccess("Bloc tableau", false);
		} else if (action === "edit") {
			const blockContent = {
				...block,
				...data,
				storymapId: storymapId,
				typeName: "table",
			};
			if (csvContentLang1.length > 0) {
				blockContent.content2_lang1 = JSON.stringify(csvContentLang1);
			}
			if (csvContentLang2.length > 0) {
				blockContent.content2_lang2 = JSON.stringify(csvContentLang2);
			}
			await updateBlock(blockContent, block?.id.toString() as string);
			notifyEditSuccess("Bloc tableau", false);
		}
		// réinitialisation des données
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	// utile si l'utilisateur passe d'un form "create" à "edit" via le panel des blocs
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (action === "edit" && block) {
			setValue("content1_lang1", block.content1_lang1);
			setValue("content1_lang2", block.content1_lang2);
			setValue("content3", block.content3 || "top");
		}
	}, [action, block]);

	const [inputs, setInputs] = useState(tableInputs);
	useEffect(() => {
		let newInputs = tableInputs;
		if (!storymapInfos?.lang2) {
			newInputs = removeLang2Inputs(tableInputs);
		}
		const newInputsWithLangInLabel = addLangageBetweenBrackets(
			newInputs,
			storymapInfos as StorymapType,
		);
		setInputs(newInputsWithLangInLabel);
	}, [storymapInfos]);

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="table" />
			<div className={style.helpContainer}>
				<a
					href="https://sharedocs.huma-num.fr/wl/?id=z18NTMXobtyLBHgpTRA0B5l41T0plfQZ&fmode=open"
					target="_blank"
					rel="noreferrer"
				>
					<CircleHelp color="grey" />
					{translation[language].backoffice.mapFormPage.uploadPointsHelp}
				</a>
			</div>

			<form
				onSubmit={handleSubmit(handlePointSubmit)}
				className={style.mapFormContainer}
			>
				{inputs.map((input) => (
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
								{...register(input.name as keyof tableInputsType, {
									required: input.required.value,
								})}
							/>
							{input.required.value &&
								errors[input.name as keyof tableInputsType] && (
									<ErrorComponent
										message={input.required.message?.[language] as string}
									/>
								)}
						</div>
					</div>
				))}
				<div className={style.mapFormInputContainer}>
					<LabelComponent
						htmlFor="tableLang1"
						label={`${
							translation[language].backoffice.storymapFormPage.form
								.uploadTableFr
						} (${storymapInfos?.lang1?.name.toUpperCase()})`}
						description=""
					/>
					<div className={style.inputContainer}>
						<input
							id="tableLang1"
							type="file"
							accept=".csv"
							onChange={(event) => handleFileUpload(event, 1)}
						/>
						{action === "edit" && (
							<p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
								<CircleCheck color="green" />
								{selectedFiles.lang1 === null
									? "Un fichier est déjà chargé"
									: `Nouveau fichier chargé : ${selectedFiles.lang1?.name}`}
							</p>
						)}
					</div>
				</div>
				{storymapInfos?.lang2 && (
					<div className={style.mapFormInputContainer}>
						<LabelComponent
							htmlFor="tableLang2"
							label={`${
								translation[language].backoffice.storymapFormPage.form
									.uploadTableFr
							} (${storymapInfos?.lang2?.name.toUpperCase()})`}
							description=""
						/>
						<div className={style.inputContainer}>
							<input
								id="tableLang2"
								type="file"
								accept=".csv"
								onChange={(event) => handleFileUpload(event, 2)}
							/>
							{action === "edit" && (
								<p
									style={{ display: "flex", alignItems: "center", gap: "5px" }}
								>
									{isLang2TableIsNotUploadedYet ? (
										<CircleX color="grey" />
									) : (
										<CircleCheck color="green" />
									)}
									{isLang2TableIsNotUploadedYet
										? "Fichier à charger"
										: selectedFiles.lang2 === null
											? "Un fichier est déjà chargé"
											: `Nouveau fichier chargé : ${selectedFiles.lang2.name}`}
								</p>
							)}
						</div>
					</div>
				)}

				<div className={style.mapFormInputContainer}>
					<LabelComponent
						htmlFor="headerPositionTop"
						label={
							translation[language].backoffice.storymapFormPage.form
								.headerPosition
						}
						description=""
					/>
					<div className={style.inputContainer}>
						<div>
							<input
								id="headerPositionTop"
								type="radio"
								value="top"
								{...register("content3", { required: true })}
								defaultChecked
							/>
							<label htmlFor="headerPositionTop">
								{
									translation[language].backoffice.storymapFormPage.form
										.headerPositionTop
								}
							</label>
						</div>
						<div>
							<input
								id="headerPositionLeft"
								type="radio"
								value="left"
								{...register("content3", { required: true })}
							/>
							<label htmlFor="headerPositionLeft">
								{
									translation[language].backoffice.storymapFormPage.form
										.headerPositionLeft
								}
							</label>
						</div>
					</div>
				</div>
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
							translation[language].backoffice.storymapFormPage.form[
								action === "create" ? "create" : "edit"
							]
						}
						icon={<ChevronRight />}
					/>
				</div>
			</form>
		</>
	);
};

export default TableForm;
