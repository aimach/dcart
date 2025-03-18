// import des bibliothèques
import { useContext, useEffect } from "react";
// import des composants
import IntroForm from "../../../components/form/mapForm/introForm/IntroForm";
import DemoMapComponent from "../../../components/builtMap/map/demoMapComponent/DemoMapComponent";
import UploadForm from "../../../components/form/mapForm/uploadForm/UploadForm";
import UserMapFilterForm from "../../../components/form/mapForm/userMapFilterForm/UserMapFilterForm";
// import des services
import { firstStepInputs } from "../../../utils/forms/mapInputArray";
import { useMapFormStore } from "../../../utils/stores/builtMap/mapFormStore";
// import du style
import style from "./BOMapFormPage.module.scss";
import { SessionContext } from "../../../context/SessionContext";
import ModalComponent from "../../../components/common/modal/ModalComponent";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import StayConnectedContent from "../../../components/common/modal/StayConnectedContent";

/**
 * Page du formulaire de création de carte
 */
const BOMapFormPage = () => {
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
		<>
			{isTimeoutReached && (
				<ModalComponent onClose={() => closeDeleteModal()} isDemo={false}>
					<StayConnectedContent />
				</ModalComponent>
			)}
			<section className={style.BOmapFormPageContainer}>
				<div>
					{step === 1 && <IntroForm inputs={firstStepInputs} />}
					{step === 2 && <UploadForm />}
					{step === 3 && <UserMapFilterForm />}
				</div>
				<DemoMapComponent showModal={step === 1} />
			</section>
		</>
	);
};

export default BOMapFormPage;
