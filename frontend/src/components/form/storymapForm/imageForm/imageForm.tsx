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

export type imageInputsType = {
	content1_fr: string;
	content1_en: string;
	content2_fr: string;
	content2_en: string;
};

interface ImageFormProps {
	parentId?: string;
	defaultValues?: BlockContentType;
}

/**
 * Formulaire pour la création d'un bloc de type "image"
 */
const ImageForm = ({ parentId, defaultValues }: ImageFormProps) => {
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
	const onSubmit: SubmitHandler<imageInputsType> = async (data) => {
		if (action === "create") {
			await createBlock({
				...data,
				content1_en: data.content1_fr, // permet de ne pas avoir 2 inputs pour la même information
				parentId,
				storymapId,
				typeName: "image",
			});
		} else if (action === "edit") {
			await updateBlock(
				{
					...block,
					...data,
					content1_en: data.content1_fr, // permet de ne pas avoir 2 inputs pour la même information
					parentId,
					storymapId,
					typeName: "image",
				},
				defaultValues ? defaultValues.id : (block?.id.toString() as string),
			);
		}
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="image" />
			<CommonForm
				onSubmit={onSubmit as SubmitHandler<allInputsType>}
				inputs={imageInputs}
				defaultValues={(defaultValues ?? block) as BlockContentType}
				action={action as string}
			/>
		</>
	);
};

export default ImageForm;
