// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { parse } from "papaparse";
import { useForm } from "react-hook-form";
// import des composants
import FormTitleComponent from "../common/FormTitleComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
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
} from "../../../../utils/functions/toast";
// import des types
import type { ChangeEvent } from "react";
import ErrorComponent from "../../errorComponent/ErrorComponent";
// import du style
import style from "../mapForms/mapForms.module.scss";
// import des icônes
import {
	ChevronLeft,
	ChevronRight,
	CircleCheck,
	CircleHelp,
} from "lucide-react";

export type tableInputsType = {
	content1_lang1: string;
	content1_lang2: string;
};

/**
 * Formulaire pour la création d'un bloc de type "title"
 */
const TableForm = () => {
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
				const parsed = parse(text, { skipEmptyLines: true });
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
	const handlePointSubmit = async (data: tableInputsType) => {
		if (action === "create") {
			await createBlock({
				...data,
				content2_lang1: JSON.stringify(csvContentLang1),
				content2_lang2: JSON.stringify(csvContentLang2),
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

	const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({
		lang1: new File([], ""),
		lang2: new File([], ""),
	});

	// utile si l'utilisateur passe d'un form "create" à "edit" via le panel des blocs
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (action === "edit" && block) {
			setValue("content1_lang1", block.content1_lang1);
			setValue("content1_lang2", block.content1_lang2);
		}
	}, [action, block]);

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="table" />
			<div className={style.helpContainer}>
				<a
					href="https://regular-twilight-01d.notion.site/Pr-parer-le-CSV-importer-tableau-1d74457ff83180b7936ec004ff956c83"
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
				{tableInputs.map((input) => (
					<div key={input.name} className={style.mapFormInputContainer}>
						<div className={style.labelContainer}>
							<label htmlFor={input.name}>{input[`label_${language}`]}</label>
						</div>
						<div className={style.inputContainer}>
							<input
								{...register(input.name as keyof tableInputsType, {
									required: input.required.value,
								})}
							/>
						</div>

						{input.required.value &&
							errors[input.name as keyof tableInputsType] && (
								<ErrorComponent
									message={input.required.message?.[language] as string}
								/>
							)}
					</div>
				))}
				<div className={style.mapFormInputContainer}>
					<LabelComponent
						htmlFor="tableLang1"
						label={
							translation[language].backoffice.storymapFormPage.form
								.uploadTableFr
						}
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
								{selectedFiles.lang1.name === ""
									? "Un fichier est déjà chargé"
									: `Nouveau fichier chargé : ${selectedFiles.lang1.name}`}
							</p>
						)}
					</div>
				</div>
				<div className={style.mapFormInputContainer}>
					<LabelComponent
						htmlFor="tableLang2"
						label={
							translation[language].backoffice.storymapFormPage.form
								.uploadTableEn
						}
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
							<p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
								<CircleCheck color="green" />
								{selectedFiles.lang2.name === ""
									? "Un fichier est déjà chargé"
									: `Nouveau fichier chargé : ${selectedFiles.lang2.name}`}
							</p>
						)}
					</div>
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
					<button type="submit">
						{
							translation[language].backoffice.storymapFormPage.form[
								action === "create" ? "create" : "edit"
							]
						}
						<ChevronRight />
					</button>
				</div>
			</form>
		</>
	);
};

export default TableForm;
