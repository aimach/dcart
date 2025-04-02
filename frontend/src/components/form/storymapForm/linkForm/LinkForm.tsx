// import des bibliothèques
import { useParams, useSearchParams } from "react-router";
// import des composants
import CommonForm from "../commonForm/CommonForm";
import FormTitleComponent from "../common/FormTitleComponent";
// import du context
// import des services
import { linkInputs } from "../../../../utils/forms/storymapInputArray";
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

export type linkFormInputs = {
	content1_lang1: string;
};

/**
 * Formulaire pour la création d'un bloc de type "link"
 */
const LinkForm = () => {
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
	const onSubmit: SubmitHandler<linkFormInputs> = async (data) => {
		if (action === "create") {
			await createBlock({
				...data,
				content1_lang2: data.content1_lang1,
				storymapId: storymapId,
				typeName: "link",
			});
			notifyCreateSuccess("Bloc lien", false);
		} else if (action === "edit") {
			await updateBlock(
				{
					...block,
					...data,
					content1_lang2: data.content1_lang1,
					storymapId: storymapId,
					typeName: "link",
				},
				block?.id.toString() as string,
			);
			notifyEditSuccess("Bloc lien", false);
		}
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="link" />
			<CommonForm
				onSubmit={onSubmit as SubmitHandler<allInputsType>}
				inputs={linkInputs}
				defaultValues={block as BlockContentType}
				action={action as string}
			/>
		</>
	);
};

export default LinkForm;
