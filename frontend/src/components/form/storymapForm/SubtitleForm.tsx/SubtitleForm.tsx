// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
// import des composants
import CommonForm from "../commonForm/CommonForm";
// import du context
// import des services
import { subtitleInputs } from "../../../../utils/forms/storymapInputArray";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useShallow } from "zustand/shallow";
import {
	createBlock,
	updateBlock,
} from "../../../../utils/api/storymap/postRequests";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
} from "../../../../utils/functions/toast";
import { removeLang2Inputs } from "../../../../utils/functions/storymap";
// import des types
import type { SubmitHandler } from "react-hook-form";
import FormTitleComponent from "../common/FormTitleComponent";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type { allInputsType } from "../../../../utils/types/formTypes";

export type subtitleInputsType = {
	content1_lang1: string;
	content1_lang2: string;
};

/**
 * Formulaire pour la création d'un bloc de type "subtitle"
 */
const SubtitleForm = () => {
	// récupération des données des stores
	const { storymapInfos, updateFormType, block, reload, setReload } =
		useBuilderStore(useShallow((state) => state));

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");

	const { storymapId } = useParams();

	// fonction appelée lors de la soumission du formulaire
	const onSubmit: SubmitHandler<subtitleInputsType> = async (data) => {
		if (action === "create") {
			await createBlock({
				...data,
				storymapId: storymapId,
				typeName: "subtitle",
			});
			notifyCreateSuccess("Bloc sous-titre", false);
		} else if (action === "edit") {
			await updateBlock(
				{
					...block,
					...data,
					storymapId: storymapId,
					typeName: "subtitle",
				},
				block?.id.toString() as string,
			);
			notifyEditSuccess("Bloc sous-titre", false);
		}
		// réinitialisation des données
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	const [inputs, setInputs] = useState(subtitleInputs);
	useEffect(() => {
		if (!storymapInfos?.lang2) {
			const newInputs = removeLang2Inputs(subtitleInputs);
			setInputs(newInputs);
		}
	}, [storymapInfos]);

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="subtitle" />
			<CommonForm
				key={block ? block.id : "subtitle"}
				onSubmit={onSubmit as SubmitHandler<allInputsType>}
				inputs={inputs}
				defaultValues={block as BlockContentType}
				action={action as string}
			/>
		</>
	);
};

export default SubtitleForm;
