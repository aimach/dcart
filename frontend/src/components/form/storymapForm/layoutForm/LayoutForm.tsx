// import des bibliothèques
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
// import des composants
import ImageForm from "../imageForm/imageForm";
import TextForm from "../textForm/TextForm";
import FormTitleComponent from "../common/FormTitleComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useShallow } from "zustand/shallow";
import {
	createBlock,
	updateBlock,
} from "../../../../utils/api/storymap/postRequests";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./layoutForm.module.scss";
// import des icônes
import { LayoutList } from "lucide-react";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
} from "../../../../utils/functions/toast";

/**
 * Formulaire pour la création d'un bloc de type "layout"
 */
const LayoutForm = () => {
	const { translation, language } = useTranslation();

	const { block, reload, setReload } = useBuilderStore(
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

	// déclération d'un état pour gérer les étapes du formulaire (layout, text, image)
	const [step, setStep] = useState(1);

	// déclaration d'un état pour stocker l'id du bloc layout parent
	const [layoutBlockId, setLayoutBlockId] = useState("");

	// définition de la fonction appelée lors du clic sur le choix de la disposition de l'image (création ou mise à jour du bloc layout)
	const handleClick = async (position: string) => {
		if (action === "create") {
			const response = await createBlock({
				content1_lang1: position,
				content1_lang2: position,
				storymapId: storymapId,
				typeName: "layout",
			});
			notifyCreateSuccess("Bloc de mise en page", false);
			setLayoutBlockId(response?.id.toString());
		} else if (action === "edit") {
			const response = await updateBlock(
				{
					...block,
					children: [],
					content1_lang1: position,
					content1_lang2: position,
					storymapId: storymapId,
					typeName: "layout",
				},
				block?.id.toString() as string,
			);
			notifyEditSuccess("Bloc de mise en page", false);
			setLayoutBlockId(response?.id.toString());
			setSearchParams({ action: "edit" });
		}
		setReload(!reload);
		// passage à l'étape suivante (formulaire texte)
		setStep(2);
	};

	// génération des valeurs par défaut pour les blocs enfants dans le cas d'une édition
	const [textDefaultValues, setTextDefaultValues] = useState<
		BlockContentType | undefined
	>(undefined);
	const [imageDefaultValues, setImageDefaultValues] = useState<
		BlockContentType | undefined
	>(undefined);
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (action === "edit") {
			setTextDefaultValues(
				block?.children.find(
					(child: BlockContentType) => child.type.name === "text",
				),
			);
			setImageDefaultValues(
				block?.children.find(
					(child: BlockContentType) => child.type.name === "image",
				),
			);
		}
	}, [action]);

	// affichage du formulaire en fonction de l'étape
	switch (step) {
		case 1:
			return (
				<>
					<FormTitleComponent
						action={action as string}
						translationKey="layout"
					/>
					<div>
						<div className={style.layoutFormButtonContainer}>
							<button type="button" onClick={() => handleClick("left")}>
								<LayoutList />
								{
									translation[language].backoffice.storymapFormPage.form
										.imageToLeft
								}
							</button>
							<button type="button" onClick={() => handleClick("right")}>
								<LayoutList />
								{
									translation[language].backoffice.storymapFormPage.form
										.imageToRight
								}
							</button>
						</div>
					</div>
				</>
			);
		case 2:
			return (
				<TextForm
					parentId={layoutBlockId}
					setStep={setStep}
					defaultValues={textDefaultValues}
				/>
			);
		case 3:
			return (
				<ImageForm
					parentId={layoutBlockId}
					defaultValues={imageDefaultValues}
				/>
			);
		default:
			return null;
	}
};

export default LayoutForm;
