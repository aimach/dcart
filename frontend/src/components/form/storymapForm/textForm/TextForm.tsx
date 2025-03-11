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

export type textInputsType = {
	content1_fr: string;
	content1_en: string;
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
	const onSubmit: SubmitHandler<textInputsType> = async (data) => {
		if (action === "create") {
			await createBlock({
				...data,
				parentId,
				storymapId,
				typeName: "text",
			});
		} else if (action === "edit") {
			await updateBlock(
				{
					...block,
					...data,
					parentId,
					storymapId,
					typeName: "text",
				},
				defaultValues ? defaultValues.id : (block?.id.toString() as string),
			);
		}
		setReload(!reload);
		if (parentId) {
			// si c'est le bloc enfant d'un bloc layout
			setStep?.(3); // passage à l'étape suivante (formulaire image)
		} else {
			updateFormType("blockChoice");
			setSearchParams(undefined);
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
