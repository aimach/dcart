// import des bibliothèques
import { useState } from "react";
import { useParams } from "react-router";
// import des composants
import SourceDetailsComponent from "./SourceDetailsComponent";
import ChartComponent from "./ChartComponent";
import InfoIntroductionContent from "./InfoIntroductionContent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import du style
import style from "./tabComponent.module.scss";
// import des icônes
import { SquareChevronRight } from "lucide-react";

/**
 * Affiche les informations du point sélectionné
 */
const InfoComponent = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération de l'id de la carte
	const { mapId, mapSlug } = useParams();
	const mapIdentifier = mapId || mapSlug;

	// récupération des données des stores
	const { selectedMarker } = useMapStore((state) => state);

	const [isIntroDisplayed, setIsIntroDisplayed] = useState(
		sessionStorage.getItem("showIntro") !== "false",
	);

	return (
		selectedMarker && (
			<section className={style.selectionDetailsContainer}>
				<h4>
					{selectedMarker.nom_ville} (
					{selectedMarker[`sous_region_${language}`]}) -{" "}
					{selectedMarker.sources.length}{" "}
					{selectedMarker.sources.length > 1 ? "sources" : "source"}
				</h4>
				{isIntroDisplayed ? (
					<InfoIntroductionContent setIsIntroDisplayed={setIsIntroDisplayed} />
				) : (
					<>
						{mapIdentifier !== "exploration" && (
							<details className={style.chartDetails} open>
								<summary>
									<SquareChevronRight width={20} />
									{translation[language].mapPage.aside.seeStat}
								</summary>
								<ChartComponent />
							</details>
						)}
						{mapIdentifier !== "exploration" ? (
							<details className={style.sourceDetails}>
								<summary>
									<SquareChevronRight width={20} />
									{translation[language].mapPage.aside.seeSources}
								</summary>
								{selectedMarker.sources.map((source) => {
									return (
										<SourceDetailsComponent
											key={source.source_id}
											source={source}
										/>
									);
								})}
							</details>
						) : (
							<>
								{selectedMarker.sources.map((source) => {
									return (
										<SourceDetailsComponent
											key={source.source_id}
											source={source}
										/>
									);
								})}
							</>
						)}
					</>
				)}
			</section>
		)
	);
};

export default InfoComponent;
