// import des bibliothèques
import { useCallback, useEffect, useMemo, useRef } from "react";
import DOMPurify from "dompurify";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { isSelectedMarker } from "../../../../utils/functions/map";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useShallow } from "zustand/shallow";
import { getShapeForLayerName } from "../../../../utils/functions/icons";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./tabComponent.module.scss";

/**
 * Affiche une liste des points affichés sur la carte (filtrés ou non)
 */
const ResultComponent = () => {
	// récupération des données de traduction
	const { language } = useTranslation();

	// récupération des données des stores
	const { mapInfos, allResults, allLayers, selectedMarker, setSelectedMarker } =
		useMapStore(
			useShallow((state) => ({
				mapInfos: state.mapInfos,
				allResults: state.allResults,
				allLayers: state.allLayers,
				selectedMarker: state.selectedMarker,
				setSelectedMarker: state.setSelectedMarker,
			})),
		);
	const { setSelectedTabMenu } = useMapAsideMenuStore(
		useShallow((state) => ({
			setSelectedTabMenu: state.setSelectedTabMenu,
		})),
	);

	// fonction pour gérer le clic sur un point (zoom et passage à l'onglet "sélection")
	const handleResultClick = useCallback(
		(result: PointType) => {
			setSelectedMarker(result);
			setSelectedTabMenu("infos");
		},
		[setSelectedMarker, setSelectedTabMenu],
	);

	const filteredResultsWithSelectedPoint = useMemo(() => {
		// filtre les points qui ne sont pas dans les calques sélectionnés
		const allResultsFiltered = mapInfos?.isLayered
			? allResults.filter((point: PointType) =>
					mapInfos
						? allLayers.some((string) =>
								string.includes(`svg> ${point.layerNamefr}`),
							)
						: point,
				)
			: allResults;
		// ajoute la classe "isSelected" aux points sélectionnés
		const allResultsFilteredWithCSS = allResultsFiltered.map(
			(point: PointType) => {
				const isSelected = isSelectedMarker(selectedMarker as PointType, point);
				return {
					...point,
					isSelected,
					selectedClassName: isSelected ? style.isSelected : undefined,
					shapeCode: DOMPurify.sanitize(
						getShapeForLayerName(point.shape as string, point.color),
					),
				};
			},
		);

		// trie les résultats par sous-région puis par nom de ville
		const allResultsInAlphaOrder = allResultsFilteredWithCSS.sort((a, b) => {
			const subRegionA = a[`sous_region_${language}`] || "";
			const subRegionB = b[`sous_region_${language}`] || "";
			if (subRegionA < subRegionB) return -1;
			if (subRegionA > subRegionB) return 1;

			const cityA = a.nom_ville || "";
			const cityB = b.nom_ville || "";
			if (cityA < cityB) return -1;
			if (cityA > cityB) return 1;

			return 0;
		});
		return allResultsInAlphaOrder;
	}, [allResults, selectedMarker, allLayers, mapInfos, language]);

	// zoom sur le point sélectionné
	const isSelectedRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (isSelectedRef.current) {
			isSelectedRef.current.scrollIntoView({
				behavior: "instant",
				block: "start",
			});
		}
	}, []);

	return (
		<div
			className={style.resultContainer}
			key={filteredResultsWithSelectedPoint.length}
		>
			{filteredResultsWithSelectedPoint.map((result: PointType, index) => {
				return (
					<div
						key={`${result.latitude}-${result.longitude}-$${index}`}
						onClick={() => handleResultClick(result)}
						onKeyUp={() => handleResultClick(result)}
						className={`${style.resultDetails} ${result.selectedClassName}`}
						ref={result.isSelected ? isSelectedRef : null}
					>
						<div
							// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
							dangerouslySetInnerHTML={{ __html: result.shapeCode as string }}
						/>

						<p>
							{result.nom_ville} ({result[`sous_region_${language}`]}) -{" "}
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
