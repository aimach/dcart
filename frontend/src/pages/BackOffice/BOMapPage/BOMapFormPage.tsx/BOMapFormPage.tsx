// import des bibliothèques
import { useEffect } from "react";
// import des composants
import DemoCommonForm from "../../../../components/form/mapForm/demoCommonForm/DemoCommonForm";
import DemoMapComponent from "../../../../components/map/demoMapComponent/DemoMapComponent";
import UploadForm from "../../../../components/form/mapForm/downloadForm/UploadForm";
// import du context
// import des services
import {
	firstStepInputs,
	secondStepInputs,
} from "../../../../utils/forms/mapInputArray";
import { useMapFormStore } from "../../../../utils/stores/mapFormStore";
// import des types
// import du style
import style from "../backofficeMapPage.module.scss";

const BOMapFormPage = () => {
	// on récupère les étapes
	const { step, setStep, resetMapInfos } = useMapFormStore((state) => state);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setStep(1);
		resetMapInfos();
	}, []);

	return (
		<section className={style.BOmapFormPageContainer}>
			<div>
				{step === 1 && <DemoCommonForm inputs={firstStepInputs} />}
				{step === 2 && <UploadForm />}
			</div>
			<DemoMapComponent showModal={step === 1} />
		</section>
	);
};

export default BOMapFormPage;
