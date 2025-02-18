// import des bibliothèques
// import des composants
import CommonForm from "../../../../components/form/mapForm/commonForm/CommonForm";
import DemoMapComponent from "../../../../components/map/demoMapComponent/DemoMapComponent";
// import du context
// import des services
import { mapInputs } from "../../../../utils/forms/mapInputArray";
import { useMapFormStore } from "../../../../utils/stores/mapFormStore";
// import des types
// import du style
import style from "../backofficeMapPage.module.scss";

const BOMapFormPage = () => {
	// on récupère les étapes
	const { step, setStep } = useMapFormStore((state) => state);
	return (
		<section className={style.BOmapFormPageContainer}>
			<div>
				{step === 1 && (
					<CommonForm
						onSubmit={() => console.log("coucou")}
						inputs={mapInputs}
						defaultValues={undefined}
					/>
				)}
			</div>
			<DemoMapComponent showModal={step === 1} />
		</section>
	);
};

export default BOMapFormPage;
