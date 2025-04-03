// import des bibliothèques
import { useParams, useSearchParams } from "react-router";
// import des composants
import CommonForm from "../commonForm/CommonForm";
import FormTitleComponent from "../common/FormTitleComponent";
// import du context
// import des services
import { textInputs } from "../../../../utils/forms/storymapInputArray";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useShallow } from "zustand/shallow";
import {
	createBlock,
	updateBlock,
} from "../../../../utils/api/storymap/postRequests";
// import des types
import type { SubmitHandler } from "react-hook-form";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type { allInputsType } from "../../../../utils/types/formTypes";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
} from "../../../../utils/functions/toast";

export type textInputsType = {
	content1_lang1: string;
	content1_lang2: string;
};

interface TextFormProps {
	parentId?: string;
	setStep?: (step: number) => void;
	defaultValues?: BlockContentType;
}

/**
 * Formulaire pour la création d'un bloc de type "text"
 */
const TextForm = ({ parentId, setStep, defaultValues }: TextFormProps) => {
	const { updateFormType, block, reload, setReload } = useBuilderStore(
		useShallow((state) => ({
			block: state.block,
			updateFormType: state.updateFormType,
			reload: state.reload,
			setReload: state.setReload,
		})),
	);

	const [searchParams, _] = useSearchParams();
	const action = searchParams.get("action");

	const { storymapId } = useParams();

	// fonction appelée lors de la soumission du formulaire
	const onSubmit: SubmitHandler<textInputsType> = async (data) => {
		if (action === "create") {
			await createBlock({
				...data,
				parentId,
				storymapId: storymapId,
				typeName: "text",
			});
			notifyCreateSuccess("Bloc texte", false);
		} else if (action === "edit") {
			await updateBlock(
				{
					...data,
					parentId,
					storymapId: storymapId,
					typeName: "text",
				},
				defaultValues ? defaultValues.id : (block?.id.toString() as string),
			);
			notifyEditSuccess("Bloc texte", false);
		}
		setReload(!reload);
		if (parentId) {
			// si c'est le bloc enfant d'un bloc layout
			setStep?.(3); // passage à l'étape suivante (formulaire image)
		} else {
			updateFormType("blockChoice");
		}
	};

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="text" />
			<CommonForm
				onSubmit={onSubmit as SubmitHandler<allInputsType>}
				inputs={textInputs}
				defaultValues={(defaultValues ?? block) as BlockContentType}
				action={action as string}
			/>
		</>
	);
};

export default TextForm;
