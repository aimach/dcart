// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
// import des composants
import CommonForm from "../commonForm/CommonForm";
import FormTitleComponent from "../common/FormTitleComponent";
// import du context
// import des services
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { titleInput } from "../../../../utils/forms/storymapInputArray";
import { useShallow } from "zustand/shallow";
import { createBlock } from "../../../../utils/api/storymap/postRequests";
import { updateBlock } from "../../../../utils/api/storymap/postRequests";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
} from "../../../../utils/functions/toast";
import { removeLang2Inputs } from "../../../../utils/functions/storymap";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type { SubmitHandler } from "react-hook-form";
import type { allInputsType } from "../../../../utils/types/formTypes";

export type titleInputsType = {
	content1_lang1: string;
	content1_lang2: string;
};

/**
 * Formulaire pour la création d'un bloc de type "title"
 */
const TitleForm = () => {
	const { storymapInfos, updateFormType, block, reload, setReload } =
		useBuilderStore(useShallow((state) => state));

	const { storymapId } = useParams();

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");

	// fonction appelée lors de la soumission du formulaire
	const onSubmit: SubmitHandler<titleInputsType> = async (data) => {
		if (action === "create") {
			await createBlock({
				...data,
				storymapId: storymapId,
				typeName: "title",
			});
			notifyCreateSuccess("Bloc titre", false);
		} else if (action === "edit") {
			await updateBlock(
				{
					...block,
					...data,
					storymapId: storymapId,
					typeName: "title",
				},
				block?.id.toString() as string,
			);
			notifyEditSuccess("Bloc titre", false);
		}
		// réinitialisation des données
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	const [inputs, setInputs] = useState(titleInput);
	useEffect(() => {
		if (!storymapInfos?.lang2) {
			const newInputs = removeLang2Inputs(titleInput);
			setInputs(newInputs);
		}
	}, [storymapInfos]);

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="title" />
			<CommonForm
				key={block ? block.id : "title"}
				onSubmit={onSubmit as SubmitHandler<allInputsType>}
				inputs={inputs}
				defaultValues={block as BlockContentType}
				action={action as string}
			/>
		</>
	);
};

export default TitleForm;
