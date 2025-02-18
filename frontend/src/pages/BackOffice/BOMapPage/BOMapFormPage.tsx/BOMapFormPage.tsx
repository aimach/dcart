// import des bibliothèques
// import des composants
import CommonForm from "../../../../components/form/mapForm/commonForm/CommonForm";
import DemoMapComponent from "../../../../components/map/demoMapComponent/DemoMapComponent";
import MapComponent from "../../../../components/map/mapComponent/MapComponent";
import { mapInputs } from "../../../../utils/forms/mapInputArray";
// import du context
// import des services
// import des types
// import du style
import style from "../backofficeMapPage.module.scss";

const BOMapFormPage = () => {
	return (
		<section className={style.BOmapFormPageContainer}>
			<div>
				<CommonForm
					onSubmit={() => console.log("coucou")}
					inputs={mapInputs}
					defaultValues={undefined}
				/>
			</div>
			<DemoMapComponent />
		</section>
	);
};

export default BOMapFormPage;
