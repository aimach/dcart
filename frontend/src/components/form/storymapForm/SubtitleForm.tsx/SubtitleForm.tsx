// import des bibliothèques
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
// import des types
import type { SubmitHandler } from "react-hook-form";
import FormTitleComponent from "../common/FormTitleComponent";
import type {
	BlockContentType,
	StorymapType,
} from "../../../../utils/types/storymapTypes";
import type { allInputsType } from "../../../../utils/types/formTypes";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
} from "../../../../utils/functions/toast";

export type subtitleInputsType = {
	content1_lang1: string;
	content1_lang2: string;
};

/**
 * Formulaire pour la création d'un bloc de type "subtitle"
 */
const SubtitleForm = () => {
	// récupération des données des stores
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

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="subtitle" />
			<CommonForm
				onSubmit={onSubmit as SubmitHandler<allInputsType>}
				inputs={subtitleInputs}
				defaultValues={block as BlockContentType}
				action={action as string}
			/>
		</>
	);
};

export default SubtitleForm;
