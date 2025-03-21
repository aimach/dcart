// import des bibliothèques
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
// import des composants
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";
// import du context
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { useShallow } from "zustand/shallow";
import PointSetUploadForm from "../pointSetUploadForm/PointSetUploadForm";
import { createPointSet } from "../../../../utils/api/builtMap/postRequests";
// import des types
import type { FormEventHandler } from "react";
import type { PointSetType } from "../../../../utils/types/mapTypes";
// import du style
import style from "../introForm/introForm.module.scss";
// import des images
import { CircleHelp } from "lucide-react";
import { getOneMapInfos } from "../../../../utils/api/builtMap/getRequests";
import ButtonComponent from "../../../common/button/ButtonComponent";

/**
 * Formulaire de la deuxième étape : upload de points sur la carte
 */
const UploadForm = () => {
	// récupération des données de la traduction
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { mapInfos, setMapInfos, step, setStep } = useMapFormStore(
		useShallow((state) => state),
	);

	// récupération des données de l'URL
	const { pathname } = useLocation();

	// définition d'un état pour afficher le bouton suivant si les points ont bien été uploadés, qui est caché par défaut en mode création
	const [nextButtonDisplayed, setNextButtonDisplayed] = useState(
		pathname.includes("edit"),
	);

	// fonction pour gérer la soumission du formulaire (passage à l'étape suivante)
	const [pointSet, setPointSet] = useState<PointSetType | null>(null);
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		const newPointSet = await createPointSet(pointSet as PointSetType);
		if (newPointSet?.status === 201) {
			setIsAlreadyAPointSet(true);
			const mapWithPointSet = await getOneMapInfos(mapInfos?.id as string);
			setMapInfos(mapWithPointSet);
		}
	};

	const [isAlreadyAPointSet, setIsAlreadyAPointSet] = useState(false);
	// biome-ignore lint/correctness/useExhaustiveDependencies: uniquement au montage
	useEffect(() => {
		if (mapInfos?.attestations) {
			setIsAlreadyAPointSet(true);
		}
		if (mapInfos?.attestations || isAlreadyAPointSet) {
			setNextButtonDisplayed(true);
		}
	}, []);

	return (
		<>
			<form onSubmit={handleSubmit} className={style.commonFormContainer}>
				<h4>{translation[language].backoffice.mapFormPage.addMapPoints}</h4>
				<div className={style.helpContainer}>
					<a
						href="https://regular-twilight-01d.notion.site/Pr-parer-le-CSV-importer-1bd4457ff831806f9291d5a75cfbcbb9?pvs=4"
						target="_blank"
						rel="noreferrer"
					>
						<CircleHelp color="grey" />
						{translation[language].backoffice.mapFormPage.uploadPointsHelp}
					</a>
				</div>
				{mapInfos?.attestations && (
					<>
						<div>
							Jeux de points :
							{mapInfos.attestations.map((pointSet) => (
								<p key={pointSet.id}>{pointSet.name}</p>
							))}
						</div>
						<ButtonComponent
							type="button"
							color="brown"
							textContent="Ajouter un nouveau jeu de points"
							onClickFunction={() => setIsAlreadyAPointSet(!isAlreadyAPointSet)}
						/>
					</>
				)}
				{!isAlreadyAPointSet && (
					<PointSetUploadForm pointSet={pointSet} setPointSet={setPointSet} />
				)}
				{isAlreadyAPointSet && (
					<NavigationButtonComponent
						step={step}
						nextButtonDisplayed={nextButtonDisplayed}
					/>
				)}
			</form>
		</>
	);
};

export default UploadForm;
