// import des bibliothèques
import { useContext, useEffect } from "react";
import { useLocation } from "react-router";
// import du contexte
import { SessionContext } from "../../../context/SessionContext";
// import des composants
import IntroForm from "../../../components/form/mapForm/introForm/IntroForm";
import DemoMapComponent from "../../../components/builtMap/map/demoMapComponent/DemoMapComponent";
import UploadForm from "../../../components/form/mapForm/uploadForm/UploadForm";
import UserMapFilterForm from "../../../components/form/mapForm/userMapFilterForm/UserMapFilterForm";
import StayConnectedContent from "../../../components/common/modal/StayConnectedContent";
import ModalComponent from "../../../components/common/modal/ModalComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { firstStepInputs } from "../../../utils/forms/mapInputArray";
import { useMapFormStore } from "../../../utils/stores/builtMap/mapFormStore";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import du style
import style from "./BOMapFormPage.module.scss";

/**
 * Page du formulaire de création de carte
 */
const BOMapFormPage = () => {
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { step, setStep, setAllPoints } = useMapFormStore((state) => state);
	const { closeDeleteModal } = useModalStore();

	// récupération des données du contexte
	const { isTimeoutReached } = useContext(SessionContext);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setStep(1);
		// reset des informations de la carte au cas où l'utilisateur revient sur la page
		setAllPoints([]);
	}, []);

	return (
		<section className={style.BOmapFormPageContainer}>
			{isTimeoutReached && (
				<ModalComponent onClose={() => closeDeleteModal()} isDemo={false}>
					<StayConnectedContent />
				</ModalComponent>
			)}
			<aside className={style.mapFormAside}>
				<ul>
					<li onClick={() => setStep(1)} onKeyUp={() => setStep(1)}>
						{translation[language].backoffice.mapFormPage.aside.informations}
					</li>
					<li onClick={() => setStep(2)} onKeyUp={() => setStep(2)}>
						{translation[language].backoffice.mapFormPage.aside.pointSets}
					</li>
					<li onClick={() => setStep(3)} onKeyUp={() => setStep(3)}>
						{translation[language].backoffice.mapFormPage.aside.filters}
					</li>
				</ul>
			</aside>
			<section className={style.mapFormContent}>
				{step === 1 && <IntroForm inputs={firstStepInputs} />}
				{step === 2 && <UploadForm />}
				{step === 3 && <UserMapFilterForm />}
			</section>
		</section>
	);
};

export default BOMapFormPage;
