// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
// import du contexte
import { SessionContext } from "../../../context/SessionContext";
// import des composants
import IntroForm from "../../../components/form/mapForm/introForm/IntroForm";
import UploadForm from "../../../components/form/mapForm/uploadForm/UploadForm";
import UserMapFilterForm from "../../../components/form/mapForm/userMapFilterForm/UserMapFilterForm";
import StayConnectedContent from "../../../components/common/modal/StayConnectedContent";
import ModalComponent from "../../../components/common/modal/ModalComponent";
import BuiltElementFilterForm from "../../../components/form/mapForm/builtElementFilterForm/BuiltElementFilterForm";
import LocationFilterForm from "../../../components/form/mapForm/locationFilterForm/LocationFilterForm";
import ButtonComponent from "../../../components/common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { firstStepInputs } from "../../../utils/forms/mapInputArray";
import { useMapFormStore } from "../../../utils/stores/builtMap/mapFormStore";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import du style
import style from "./BOMapFormPage.module.scss";
// import des icônes
import { FileText, Filter, ListTodo, MapPin, MapPinCheck } from "lucide-react";
import { isSelectedFilterInThisMap } from "../../../utils/functions/filter";

/**
 * Page du formulaire de création de carte
 */
const BOMapFormPage = () => {
	const { translation, language } = useTranslation();

	const { pathname } = useLocation();

	const navigate = useNavigate();

	// récupération des données des stores
	const { mapInfos, mapFilters, step, setStep } = useMapFormStore(
		(state) => state,
	);
	const { closeDeleteModal } = useModalStore();

	// récupération des données du contexte
	const { isTimeoutReached } = useContext(SessionContext);

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
			{isTimeoutReached && (
				<ModalComponent onClose={() => closeDeleteModal()}>
					<StayConnectedContent />
				</ModalComponent>
			)}
			<aside className={style.mapFormAside}>
				<div className={style.mapFormAsideHeader}>
					{isMapCreated && (
						<ButtonComponent
							type="button"
							textContent={
								translation[language].backoffice.storymapFormPage.preview
							}
							color="brown"
							onClickFunction={() => {
								navigate(`/backoffice/maps/preview/${mapInfos?.id}`);
							}}
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
					{(isSelectedFilterInThisMap(mapInfos, "element") ||
						mapFilters.element) && (
						<li
							onClick={() => setStep(4)}
							onKeyUp={() => setStep(4)}
							className={`${step === 4 && style.isSelected}`}
						>
							<ListTodo size={20} />
							Options filtre éléments
						</li>
					)}
					{(isSelectedFilterInThisMap(mapInfos, "location") ||
						mapFilters.location) && (
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
