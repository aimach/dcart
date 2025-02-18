// import des bibliothèques
// import des composants
import { useEffect } from "react";
import DemoCommonForm from "../../../../components/form/mapForm/demoCommonForm/DemoCommonForm";
import DemoMapComponent from "../../../../components/map/demoMapComponent/DemoMapComponent";
// import du context
// import des services
import { firstStepInputs } from "../../../../utils/forms/mapInputArray";
import { useMapFormStore } from "../../../../utils/stores/mapFormStore";
// import des types
// import du style
import style from "../backofficeMapPage.module.scss";

const BOMapFormPage = () => {
	// on récupère les étapes
	const { step, setStep, resetMapInfos } = useMapFormStore((state) => state);

	useEffect(() => {
		setStep(1);
		resetMapInfos();
	}, []);

	return (
		<section className={style.BOmapFormPageContainer}>
			<div>
				{step === 1 && (
					<DemoCommonForm inputs={firstStepInputs} defaultValues={undefined} />
				)}
			</div>
			<DemoMapComponent showModal={step === 1} />
		</section>
	);
};

export default BOMapFormPage;
