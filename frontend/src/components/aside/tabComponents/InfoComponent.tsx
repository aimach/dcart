// import des bibliothèques
import { useContext } from "react";
// import des composants
import SourceDetailsComponent from "./SourceDetailsComponent";
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

const InfoComponent = ({ point, isSelected, mapId }: InfoComponentProps) => {
	// on récupère le language
	const { language } = useContext(TranslationContext);

	// on prépare les clés pour l'objet de traduction
	const subRegionLanguageKey: keyof PointType =
		language === "fr" ? "sous_region_fr" : "sous_region_en";

	// on créé une classe spéciale si le point est sélectionné
	const selectedClassName = isSelected ? style.isSelected : undefined;

	return (
		<details className={`${selectedClassName} ${style.resultContainer}`}>
			<summary>
				{point.nom_ville} ({point[subRegionLanguageKey]}) -{" "}
				{point.sources.length} {point.sources.length > 1 ? "sources" : "source"}
			</summary>
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
	);
};

export default InfoComponent;
