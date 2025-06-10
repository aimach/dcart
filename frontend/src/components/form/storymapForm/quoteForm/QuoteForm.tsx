// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
// import des composants
import CommonForm from "../commonForm/CommonForm";
import FormTitleComponent from "../common/FormTitleComponent";
// import du context
// import des services
import { quoteInputs } from "../../../../utils/forms/storymapInputArray";
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
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type { allInputsType } from "../../../../utils/types/formTypes";

export type quoteInputsType = {
	content1_lang1: string;
	content1_lang2: string;
};

/**
 * Formulaire pour la création d'un bloc de type "quote"
 */
const QuoteForm = () => {
	const { storymapInfos, updateFormType, block, reload, setReload } =
		useBuilderStore(useShallow((state) => state));

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");

	const { storymapId } = useParams();

	// fonction appelée lors de la soumission du formulaire
	const onSubmit: SubmitHandler<quoteInputsType> = async (data) => {
		if (action === "create") {
			await createBlock({
				...data,
				storymapId: storymapId,

				typeName: "quote",
			});
			notifyCreateSuccess("Bloc citation", false);
		} else if (action === "edit") {
			await updateBlock(
				{
					...block,
					...data,
					storymapId: storymapId,

					typeName: "quote",
				},
				block?.id.toString() as string,
			);
			notifyEditSuccess("Bloc citation", false);
		}
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	const [inputs, setInputs] = useState(quoteInputs);
	useEffect(() => {
		if (!storymapInfos?.lang2) {
			const newInputs = removeLang2Inputs(quoteInputs);
			setInputs(newInputs);
		}
	}, [storymapInfos]);

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="quote" />
			<CommonForm
				key={block ? block.id : "quote"}
				onSubmit={onSubmit as SubmitHandler<allInputsType>}
				inputs={inputs}
				defaultValues={block as BlockContentType}
				action={action as string}
			/>
		</>
	);
};

export default QuoteForm;
