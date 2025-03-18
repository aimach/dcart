// import des bibliothèques
import { useContext } from "react";
// import des composants
import IntroductionForm from "../../../../components/form/storymapForm/introductionForm/IntroductionForm";
import ModalComponent from "../../../../components/common/modal/ModalComponent";
import StayConnectedContent from "../../../../components/common/modal/StayConnectedContent";
// import du context
import { SessionContext } from "../../../../context/SessionContext";
// import des services
import { useModalStore } from "../../../../utils/stores/storymap/modalStore";
// import du style
import style from "./storymapIntroPage.module.scss";

/**
 * Page d'introduction à la création d'une storymap : définition du titre, de la description, de l'image de couverture, etc.
 * @returns IntroductionForm
 */
const StorymapIntroPage = () => {
	// récupération des données du contexte
	const { isTimeoutReached } = useContext(SessionContext);

	// récupération des données des stores
	const { closeDeleteModal } = useModalStore();

	return (
		<>
			{isTimeoutReached && (
				<ModalComponent onClose={() => closeDeleteModal()} isDemo={false}>
					<StayConnectedContent />
				</ModalComponent>
			)}
			<div className={style.storymapIntroContainer}>
				<IntroductionForm />
			</div>
		</>
	);
};

export default StorymapIntroPage;
