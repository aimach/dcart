// import des bibliothèques
import { useParams, useSearchParams } from "react-router";
// import des composants
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { createBlock } from "../../../../utils/api/storymap/postRequests";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { getTypeIcon } from "../../../../utils/functions/block";
// import des types
import type { TypeType } from "../../../../utils/types/storymapTypes";
import { notifyCreateSuccess } from "../../../../utils/functions/toast";

type BlockChoiceItemProps = {
	blockType: TypeType;
};

/**
 * Retourne un élément de la liste du choix du type de block avec son icône et son nom
 * @param blockType - le type du bloc à afficher
 */
const BlockChoiceItem = ({ blockType }: BlockChoiceItemProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des paramètres de l'url
	const [_, setSearchParams] = useSearchParams();

	// récupération des données des stores
	const { reload, setReload, updateFormType } = useBuilderStore();

	// récupération de l'id de la storymap
	const { storymapId } = useParams();

	// définition de l'icône du type de bloc
	const typeIcon = getTypeIcon(blockType.name);

	// fonction pour gérer le clic sur un type de bloc : si c'est un séparateur, création du bloc de type séparateur (pas de formulaire), sinon mise à jour du type de formulaire et affichage du formulaire correspondant
	const handleBlockChoiceClick = async (blockType: TypeType) => {
		if (blockType.name === "separator") {
			await createBlock({
				content1_lang1: "",
				content1_lang2: "",
				storymapId,
				typeName: "separator",
			});
			notifyCreateSuccess("Bloc séparateur", false);
			setReload(!reload);
		} else {
			updateFormType(blockType.name);
			setSearchParams({ action: "create" });
		}
	};
	return (
		<li
			key={blockType.id}
			onClick={() => handleBlockChoiceClick(blockType)}
			onKeyUp={() => handleBlockChoiceClick(blockType)}
		>
			{typeIcon}
			{
				translation[language].backoffice.storymapFormPage.types[
					blockType.name as keyof typeof translation.en.backoffice.storymapFormPage.types
				]
			}
		</li>
	);
};

export default BlockChoiceItem;
