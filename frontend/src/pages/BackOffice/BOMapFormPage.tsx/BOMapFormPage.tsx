// import des bibliothèques
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
// import du contexte
// import des composants
import IntroForm from "../../../components/form/mapForm/introForm/IntroForm";
import UploadForm from "../../../components/form/mapForm/uploadForm/UploadForm";
import UserMapFilterForm from "../../../components/form/mapForm/userMapFilterForm/UserMapFilterForm";
import BuiltElementFilterForm from "../../../components/form/mapForm/builtElementFilterForm/BuiltElementFilterForm";
import LocationFilterForm from "../../../components/form/mapForm/locationFilterForm/LocationFilterForm";
import ButtonComponent from "../../../components/common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { firstStepInputs } from "../../../utils/forms/mapInputArray";
import { useMapFormStore } from "../../../utils/stores/builtMap/mapFormStore";
import { isSelectedFilterInThisMap } from "../../../utils/functions/filter";
// import du style
import style from "./BOMapFormPage.module.scss";
// import des icônes
import { FileText, Filter, ListTodo, MapPin, MapPinCheck } from "lucide-react";

/**
 * Page du formulaire de création de carte
 */
const BOMapFormPage = () => {
	const { translation, language } = useTranslation();

	const { pathname } = useLocation();

	// récupération des données des stores
	const { mapInfos, step, setStep } = useMapFormStore((state) => state);

	const [isMapCreated, setIsMapCreated] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setStep(1);
		if (pathname.includes("create")) {
			setIsMapCreated(false);
		}
		if (pathname.includes("edit")) {
			setIsMapCreated(true);
		}
	}, []);

	return (
		<section className={style.BOmapFormPageContainer}>
			<aside className={style.mapFormAside}>
				<div className={style.mapFormAsideHeader}>
					{isMapCreated && (
						<ButtonComponent
							type="route"
							color="brown"
							textContent={
								translation[language].backoffice.storymapFormPage.preview
							}
							link={`/backoffice/maps/preview/${mapInfos?.id}`}
						/>
					)}
				</div>
				<ul>
					<li
						onClick={() => setStep(1)}
						onKeyUp={() => setStep(1)}
						className={step === 1 ? style.isSelected : ""}
					>
						<FileText size={20} />
						{translation[language].backoffice.mapFormPage.aside.informations}
					</li>
					<li
						onClick={!isMapCreated ? undefined : () => setStep(2)}
						onKeyUp={!isMapCreated ? undefined : () => setStep(2)}
						className={`${!isMapCreated && style.disabled} ${
							step === 2 && style.isSelected
						}`}
					>
						<MapPin size={20} />
						{translation[language].backoffice.mapFormPage.aside.pointSets}
					</li>
					<li
						onClick={!isMapCreated ? undefined : () => setStep(3)}
						onKeyUp={!isMapCreated ? undefined : () => setStep(3)}
						className={`${!isMapCreated && style.disabled} ${
							step === 3 && style.isSelected
						}`}
					>
						<Filter size={20} />
						{translation[language].backoffice.mapFormPage.aside.filters}
					</li>
					{isSelectedFilterInThisMap(mapInfos, "element") && (
						<li
							onClick={() => setStep(4)}
							onKeyUp={() => setStep(4)}
							className={`${step === 4 && style.isSelected}`}
						>
							<ListTodo size={20} />
							Options filtre éléments
						</li>
					)}
					{isSelectedFilterInThisMap(mapInfos, "location") && (
						<li
							onClick={() => setStep(5)}
							onKeyUp={() => setStep(5)}
							className={`${step === 5 && style.isSelected}`}
						>
							<MapPinCheck size={20} />
							Options filtre lieux
						</li>
					)}
				</ul>
			</aside>
			<section className={style.mapFormContent}>
				{step === 1 && (
					<IntroForm
						inputs={firstStepInputs}
						setIsMapCreated={setIsMapCreated}
					/>
				)}
				{step === 2 && <UploadForm />}
				{step === 3 && <UserMapFilterForm />}
				{step === 4 && <BuiltElementFilterForm />}
				{step === 5 && <LocationFilterForm />}
			</section>
		</section>
	);
};

export default BOMapFormPage;
