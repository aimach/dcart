// import des bibliothèques
import { useState, useEffect, useContext } from "react";
// import des composants
import SourceDetailsComponent from "./SourceDetailsComponent";
import ChartComponent from "./ChartComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { getAllSourcesAndAttestationsFromPoint } from "../../../utils/loaders/loaders";
// import des types
import type { PointType, SourceType } from "../../../utils/types/mapTypes";
// import du style
import style from "./tabComponent.module.scss";
import { set } from "react-hook-form";
import LoaderComponent from "../../common/loader/LoaderComponent";

interface InfoComponentProps {
	point: PointType;
	isSelected?: boolean;
	mapId: string;
}

const InfoComponent = ({ point, mapId }: InfoComponentProps) => {
	// on récupère le language
	const { language } = useContext(TranslationContext);

	// on prépare les clés pour l'objet de traduction
	const subRegionLanguageKey: keyof PointType =
		language === "fr" ? "sous_region_fr" : "sous_region_en";

	// on va récupérer toutes les sources et attestations du point
	const [pointWithSources, setPointWithSources] = useState<PointType>(
		point as PointType,
	);
	const fetchAllSourcesFromPoint = async () => {
		try {
			const allSourcesAndAttestations =
				await getAllSourcesAndAttestationsFromPoint(
					point.latitude,
					point.longitude,
				);
			setPointWithSources({ ...point, sources: allSourcesAndAttestations });
		} catch (error) {
			console.error("Erreur lors du chargement des sources du point:", error);
		}
	};
	console.log(pointWithSources);
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (mapId === "exploration") {
			fetchAllSourcesFromPoint();
		}
	}, [point, mapId]);

	return pointWithSources.sources[0].attestations ? (
		<section className={style.selectionDetailsContainer}>
			<h4>
				{point.nom_ville} ({point[subRegionLanguageKey]}) -{" "}
				{point.sources.length} {point.sources.length > 1 ? "sources" : "source"}
			</h4>
			<details className={style.chartDetails} open>
				<summary>Voir les statistiques</summary>
				<ChartComponent point={pointWithSources as PointType} />
			</details>
			<details className={style.sourceDetails}>
				<summary>Voir les sources</summary>
				{pointWithSources.sources.map((source) => {
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
	) : (
		<LoaderComponent size={40} />
	);
};

export default InfoComponent;
