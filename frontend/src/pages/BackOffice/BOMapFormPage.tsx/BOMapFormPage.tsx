// import des bibliothèques
import { useEffect } from "react";
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

/**
 * Page du formulaire de création de carte
 */
const BOMapFormPage = () => {
	// récupération des données des stores
	const { step, setStep } = useMapFormStore((state) => state);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setStep(1);
	}, []);

	return (
		<section className={style.BOmapFormPageContainer}>
			<div>
				{step === 1 && <IntroForm inputs={firstStepInputs} />}
				{step === 2 && <UploadForm />}
				{step === 3 && <UserMapFilterForm />}
			</div>
			<DemoMapComponent showModal={step === 1} />
		</section>
	);
};

export default BOMapFormPage;
