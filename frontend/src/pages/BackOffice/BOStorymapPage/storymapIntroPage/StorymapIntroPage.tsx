// import des bibliothèques
import { useState, useContext } from "react";
// import des composants
import IntroductionForm from "../../../../components/form/storymapForm/introductionForm/IntroductionForm";
import ModalComponent from "../../../../components/common/modal/ModalComponent";
import StayConnectedContent from "../../../../components/common/modal/StayConnectedContent";
// import du context
import { SessionContext } from "../../../../context/SessionContext";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useModalStore } from "../../../../utils/stores/storymap/modalStore";
// import du style
import style from "./storymapIntroPage.module.scss";

/**
 * Page d'introduction à la création d'une storymap : définition du titre, de la description, de l'image de couverture, etc.
 * @returns IntroductionForm
 */
const StorymapIntroPage = () => {
	const { translation, language } = useTranslation();
	// récupération des données du contexte
	const { isTimeoutReached } = useContext(SessionContext);

	// récupération des données des stores
	const { closeDeleteModal } = useModalStore();

	const [step, setStep] = useState(1);

	return (
		<section className={style.BOStorymapFormPageContainer}>
			{isTimeoutReached && (
				<ModalComponent onClose={() => closeDeleteModal()} isDemo={false}>
					<StayConnectedContent />
				</ModalComponent>
			)}
			<aside className={style.storymapFormAside}>
				<ul>
					<li
						onClick={() => setStep(1)}
						onKeyUp={() => setStep(1)}
						className={step === 1 ? style.isSelected : ""}
					>
						Introduction
					</li>
					<li onClick={() => setStep(2)} onKeyUp={() => setStep(2)}>
						Blocs
					</li>
				</ul>
			</aside>
			<section className={style.storymapFormContent}>
				{step === 1 && <IntroductionForm />}
			</section>
		</section>
	);
};

export default StorymapIntroPage;
