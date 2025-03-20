// import des bibliothèques
import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { parse } from "papaparse";
import { useForm } from "react-hook-form";
// import des composants
import FormTitleComponent from "../common/FormTitleComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { tableInputs } from "../../../../utils/forms/storymapInputArray";
import { useShallow } from "zustand/shallow";
import { createBlock } from "../../../../utils/api/storymap/postRequests";
import { updateBlock } from "../../../../utils/api/storymap/postRequests";
// import des types
import type { ChangeEvent } from "react";
import ErrorComponent from "../../errorComponent/ErrorComponent";
// import du style
import style from "../mapForms/mapForms.module.scss";
// import des icônes
import { ChevronRight } from "lucide-react";

export type tableInputsType = {
	content1_fr: string;
	content1_en: string;
};

/**
 * Formulaire pour la création d'un bloc de type "title"
 */
const TableForm = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { updateFormType, block, reload, setReload } = useBuilderStore(
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

	// récupération de l'action à effectuer (création ou édition)
	const action = searchParams.get("action");

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
					} else {
						setCsvContentLang2(parsed.data as string[][]);
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
		formState: { errors },
	} = useForm<tableInputsType>({
		defaultValues: block as tableInputsType,
	});

	// fonction appelée lors de la soumission du formulaire
	const handlePointSubmit = async (data: tableInputsType) => {
		if (action === "create") {
			await createBlock({
				...data,
				content2_fr: JSON.stringify(csvContentLang1),
				content2_en: JSON.stringify(csvContentLang2),
				storymapId,
				typeName: "table",
			});
		} else if (action === "edit") {
			const blockContent = { ...block, ...data, storymapId, typeName: "table" };
			if (csvContentLang1.length > 0) {
				blockContent.content2_fr = JSON.stringify(csvContentLang1);
			}
			if (csvContentLang2.length > 0) {
				blockContent.content2_en = JSON.stringify(csvContentLang2);
			}
			await updateBlock(blockContent, block?.id.toString() as string);
		}
		// réinitialisation des données
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="table" />
			<form
				onSubmit={handleSubmit(handlePointSubmit)}
				className={style.mapFormContainer}
			>
				{tableInputs.map((input) => (
					<div key={input.name} className={style.mapFormInputContainer}>
						<label htmlFor={input.name}>{input[`label_${language}`]}</label>
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
				))}
				<div className={style.mapFormUploadInputContainer}>
					<label htmlFor="tableLang1">
						{
							translation[language].backoffice.storymapFormPage.form
								.uploadTableFr
						}
					</label>
					<input
						id="tableLang1"
						type="file"
						accept=".csv"
						onChange={(event) => handleFileUpload(event, 1)}
					/>
				</div>
				<div className={style.mapFormUploadInputContainer}>
					<label htmlFor="tableLang2">
						{
							translation[language].backoffice.storymapFormPage.form
								.uploadTableEn
						}
					</label>
					<input
						id="tableLang2"
						type="file"
						accept=".csv"
						onChange={(event) => handleFileUpload(event, 2)}
					/>
				</div>
				<button type="submit">
					{
						translation[language].backoffice.storymapFormPage.form[
							action as string
						]
					}{" "}
					<ChevronRight />
				</button>
			</form>
		</>
	);
};

export default TableForm;
