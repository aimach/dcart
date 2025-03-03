// import des bibliothèques
import { useContext } from "react";
// import des composants
import SourceDetailsComponent from "./SourceDetailsComponent";
import ChartComponent from "./ChartComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des types
import type { PointType } from "../../../utils/types/mapTypes";
// import du style
import style from "./tabComponent.module.scss";

interface InfoComponentProps {
	point: PointType;
	isSelected?: boolean;
	mapId: string;
}

/**
 * Affiche les informations du point sélectionné
 * @param {Object} props
 * @param {PointType} props.point - Les informations du point sélectionné
 * @param {string} props.mapId - Identifiant de la carte
 */
const InfoComponent = ({ point, mapId }: InfoComponentProps) => {
	// on récupère le language
	const { translation, language } = useContext(TranslationContext);

	// on prépare les clés pour l'objet de traduction
	const subRegionLanguageKey: keyof PointType =
		language === "fr" ? "sous_region_fr" : "sous_region_en";

	return (
		<section className={style.selectionDetailsContainer}>
			<h4>
				{point.nom_ville} ({point[subRegionLanguageKey]}) -{" "}
				{point.sources.length} {point.sources.length > 1 ? "sources" : "source"}
			</h4>
			{mapId !== "exploration" && (
				<details className={style.chartDetails} open>
					<summary>{translation[language].mapPage.aside.seeStat}</summary>
					<ChartComponent point={point as PointType} />
				</details>
			)}
			<details className={style.sourceDetails}>
				<summary>{translation[language].mapPage.aside.seeSources}</summary>
				{point.sources.map((source) => {
					return (
						<SourceDetailsComponent
							key={source.source_id}
							source={source}
							mapId={mapId}
						/>
					);
				})}
			</details>
		</section>
	);
};

export default InfoComponent;
