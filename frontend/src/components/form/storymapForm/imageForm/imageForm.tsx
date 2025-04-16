// import des bibliothèques
import { useParams, useSearchParams } from "react-router";
// import des composants
import CommonForm from "../commonForm/CommonForm";
import FormTitleComponent from "../common/FormTitleComponent";
// import du context
// import des services
import { imageInputs } from "../../../../utils/forms/storymapInputArray";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import {
	createBlock,
	updateBlock,
} from "../../../../utils/api/storymap/postRequests";
import { useShallow } from "zustand/shallow";
// import des types
import type { SubmitHandler } from "react-hook-form";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type { allInputsType } from "../../../../utils/types/formTypes";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
} from "../../../../utils/functions/toast";

export type imageInputsType = {
	content1_lang1: string;
	content1_lang2: string;
	content2_lang1: string;
	content2_lang2: string;
};

interface ImageFormProps {
	parentId?: string;
	defaultValues?: BlockContentType;
}

/**
 * Formulaire pour la création d'un bloc de type "image"
 */
const ImageForm = ({ parentId, defaultValues }: ImageFormProps) => {
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
	const onSubmit: SubmitHandler<imageInputsType> = async (data) => {
		if (action === "create") {
			await createBlock({
				...data,
				content1_lang2: data.content1_lang1, // permet de ne pas avoir 2 inputs pour la même information
				parentId,
				storymapId: storymapId,

				typeName: "image",
			});
			notifyCreateSuccess("Bloc image", false);
		} else if (action === "edit") {
			await updateBlock(
				{
					...data,
					content1_lang2: data.content1_lang1, // permet de ne pas avoir 2 inputs pour la même information
					parentId,
					storymapId: storymapId,

					typeName: "image",
				},
				defaultValues ? defaultValues.id : (block?.id.toString() as string),
			);
			notifyEditSuccess("Bloc image", false);
		}
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="image" />
			<CommonForm
				key={block ? block.id : "image"}
				onSubmit={onSubmit as SubmitHandler<allInputsType>}
				inputs={imageInputs}
				defaultValues={(defaultValues ?? block) as BlockContentType}
				action={action as string}
			/>
		</>
	);
};

export default ImageForm;
