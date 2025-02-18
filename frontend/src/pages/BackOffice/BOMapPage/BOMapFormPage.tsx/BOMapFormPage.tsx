// import des bibliothèques
// import des composants
import CommonForm from "../../../../components/form/mapForm/commonForm/CommonForm";
import { mapInputs } from "../../../../utils/forms/mapInputArray";
// import du context
// import des services
// import des types
// import du style

const BOMapFormPage = () => {
	return (
		<div>
			<CommonForm
				onSubmit={() => console.log("coucou")}
				inputs={mapInputs}
				defaultValues={undefined}
			/>
		</div>
	);
};

export default BOMapFormPage;
