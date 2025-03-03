// import des bibliothèques
import { useContext } from "react";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import {
	isSelectedMarker,
	zoomOnMarkerOnClick,
} from "../../../utils/functions/map";
import { useMapStore } from "../../../utils/stores/mapStore";
import { useShallow } from "zustand/shallow";
import { useMapAsideMenuStore } from "../../../utils/stores/mapAsideMenuStore";
// import des types
import type { PointType } from "../../../utils/types/mapTypes";
import type { Map as LeafletMap } from "leaflet";
// import du style
import style from "./tabComponent.module.scss";
// import des icônes
import { MapPin } from "lucide-react";

interface ResultComponentProps {
	results: PointType[];
}

/**
 * Affiche une liste des points affichés sur la carte (filtrés ou non)
 * @param {Object} props
 * @param {PointType[]} props.results - Liste des points à afficher
 */
const ResultComponent = ({ results }: ResultComponentProps) => {
	// on récupère le language
	const { language } = useContext(TranslationContext);

	// on récupère les informations de la carte depuis le store
	const { map, selectedMarker, setSelectedMarker } = useMapStore(
		useShallow((state) => ({
			map: state.map,
			selectedMarker: state.selectedMarker,
			setSelectedMarker: state.setSelectedMarker,
		})),
	);
	const { setSelectedTabMenu } = useMapAsideMenuStore(
		useShallow((state) => ({
			setSelectedTabMenu: state.setSelectedTabMenu,
		})),
	);

	// on définit un style différent pour le point sélectionné
	const handleResultClick = (result: PointType) => {
		setSelectedMarker(result);
		setSelectedTabMenu("infos");
		zoomOnMarkerOnClick(map as LeafletMap, result as PointType);
	};
	return (
		<div className={style.resultContainer}>
			{results.map((result: PointType) => {
				const isSelected = isSelectedMarker(
					selectedMarker as PointType,
					result,
				);
				const selectedClassName = isSelected ? style.isSelected : undefined;
				// on prépare les clés pour l'objet de traduction
				const subRegionLanguageKey: keyof PointType =
					language === "fr" ? "sous_region_fr" : "sous_region_en";
				return (
					<div
						key={`${result.latitude}-${result.longitude}`}
						onClick={() => handleResultClick(result)}
						onKeyUp={() => handleResultClick(result)}
						className={`${style.resultDetails} ${selectedClassName}`}
					>
						<MapPin />
						<p>
							{result.nom_ville} ({result[subRegionLanguageKey]}) -{" "}
							{result.sources.length}{" "}
							{result.sources.length > 1 ? "sources" : "source"}
						</p>
					</div>
				);
			})}
		</div>
	);
};

export default ResultComponent;
