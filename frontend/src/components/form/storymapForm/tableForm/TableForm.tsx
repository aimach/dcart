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
import type { SubmitHandler } from "react-hook-form";
import type { ChangeEvent } from "react";
import ErrorComponent from "../../errorComponent/ErrorComponent";
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

	// fonction appelée lors de la soumission du formulaire
	const onSubmit: SubmitHandler<tableInputsType> = async (data) => {
		if (action === "create") {
			await createBlock({
				...data,
				storymapId,
				typeName: "table",
			});
		} else if (action === "edit") {
			await updateBlock(
				{
					...block,
					...data,
					storymapId,
					typeName: "table",
				},
				block?.id.toString() as string,
			);
		}
		// réinitialisation des données
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	// gestion de l'upload du fichier csv
	const [csvContent, setCsvContent] = useState<string[][]>([]);
	const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const text = e.target?.result as string;
				const parsed = parse(text, { skipEmptyLines: true });
				if (parsed.data) {
					setCsvContent(parsed.data as string[][]);
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
		console.log(data);
		if (action === "create") {
			await createBlock({
				...data,
				content2_fr: JSON.stringify(csvContent),
				content2_en: JSON.stringify(csvContent),
				storymapId,
				typeName: "table",
			});
		} else if (action === "edit") {
			await updateBlock(
				{
					...block,
					...data,
					content2_fr: JSON.stringify(csvContent),
					content2_en: JSON.stringify(csvContent),
					storymapId,
					typeName: "table",
				},
				block?.id.toString() as string,
			);
		}
		// réinitialisation des données
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="table" />
			<form onSubmit={handleSubmit(handlePointSubmit)}>
				{tableInputs.map((input) => (
					<div key={input.name}>
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
				<div>
					<label htmlFor="points">
						{translation[language].backoffice.storymapFormPage.form.csv}
					</label>
					<input
						id="point"
						type="file"
						accept=".csv"
						onChange={handleFileUpload}
					/>
				</div>
				<button type="submit">
					Suivant <ChevronRight />
				</button>
			</form>
		</>
	);
};

export default TableForm;
