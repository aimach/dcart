// import des bibliothèques
import { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import L from "leaflet";
// import des services
import {
	getDefaultIcon,
	getLittleCircleIcon,
} from "../../../../utils/functions/icons";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type {
	BlockContentType,
	GroupedTyped,
} from "../../../../utils/types/storymapTypes";
import type { LatLngTuple } from "leaflet";
// import du style
import style from "./comparisonMapBloc.module.scss";
import "./comparisonMapBloc.css";
import "leaflet/dist/leaflet.css";
import "leaflet-side-by-side";
import { getBackGroundColorClassName } from "../../../../utils/functions/map";

interface ComparisonMapBlockProps {
	blockContent: BlockContentType;
}

const ComparisonMapBlock = ({ blockContent }: ComparisonMapBlockProps) => {
	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

	const mapName = useMemo(() => `comparison-map-${uuidv4}`, []);

	useEffect(() => {
		const bounds: LatLngTuple[] = blockContent.groupedPoints?.map(
			(point) => [point.latitude, point.longitude] as LatLngTuple,
		);
		const comparisonMap = L.map(mapName, {
			scrollWheelZoom: false,
		});
		comparisonMap.fitBounds(bounds);

		comparisonMap.createPane("left");
		comparisonMap.createPane("right");

		const attribution =
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

		const rightLayer = L.tileLayer(blockContent.content2_lang2, {
			pane: "right",
			attribution,
		}).addTo(comparisonMap);

		const leftLayer = L.tileLayer(blockContent.content2_lang1, {
			pane: "left",
			attribution,
		}).addTo(comparisonMap);

		// on créé les points sur chaque pane
		(blockContent.groupedPoints as GroupedTyped[]).map((point) => {
			// on créé une icone adaptée au nombre de sources
			const icon = getDefaultIcon(
				point.attestations.length,
				style,
				getBackGroundColorClassName(point.attestations.length),
				point.attestations.length.toString(),
			);

			if (point.attestations[0].location?.includes("Kinaros")) {
				console.log(point)
			}

			const popupContent = `<h4>${point.attestations[0][`title_${selectedLanguage}`] ?? point.attestations[0].location}</h4><p>${point.attestations[0][`description_${selectedLanguage}`] ?? ''}</p>`;
			L.marker([point.latitude, point.longitude], {
				pane: point.pane,
				shadowPane: point.pane,
				icon: icon,
			})
				.addTo(comparisonMap)
				.bindPopup(popupContent as string);
		});

		// on créé un point miniature sur le pane opposé
		(blockContent.groupedPoints as GroupedTyped[]).map((point) => {
			L.marker([point.latitude, point.longitude], {
				pane: point.pane === "left" ? "right" : "left",
				shadowPane: point.pane === "left" ? "right" : "left",
				icon: getLittleCircleIcon(style),
			}).addTo(comparisonMap);
		});

		L.control.sideBySide(leftLayer, rightLayer).addTo(comparisonMap);

		return () => {
			comparisonMap.remove();
		};
	}, [blockContent.groupedPoints, mapName]);

	return (
		<>
			<div id={mapName} />
			{blockContent[`content1_${selectedLanguage}`] && (
				<p>{blockContent[`content1_${selectedLanguage}`]}</p>
			)}
		</>
	);
};

export default ComparisonMapBlock;
