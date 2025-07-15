// import des bibliothèques
import { useCallback, useEffect, useState } from "react";
import L from "leaflet";
// import des services
import {
	getIcon,
	getLittleCircleIcon,
} from "../../../../utils/functions/icons";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
import { getAllPointsByBlockId } from "../../../../utils/api/builtMap/getRequests";
import { getMapAttribution } from "../../../../utils/functions/map";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import type { LatLngTuple } from "leaflet";
import type { PointType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./comparisonMapBloc.module.scss";
import "./comparisonMapBloc.css";
import "leaflet/dist/leaflet.css";
import "leaflet-side-by-side";

interface ComparisonMapBlockProps {
	blockContent: BlockContentType;
	mapName: string;
}

const ComparisonMapBlock = ({
	blockContent,
	mapName,
}: ComparisonMapBlockProps) => {
	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

	const [leftPoints, setLeftPoints] = useState<PointType[]>([]);
	const [rightPoints, setRightPoints] = useState<PointType[]>([]);
	const [bothSidesPoints, setBothSidesPoints] = useState<PointType[]>([]);

	const fetchAllPoints = useCallback(async () => {
		const leftPointsArray = await getAllPointsByBlockId(
			blockContent.id,
			"left",
		);
		const rightPointsArray = await getAllPointsByBlockId(
			blockContent.id,
			"right",
		);
		setLeftPoints(leftPointsArray);
		setRightPoints(rightPointsArray);
		const bothSidesPointsArray = [...leftPointsArray, ...rightPointsArray];
		setBothSidesPoints(bothSidesPointsArray);
	}, [blockContent.id]);

	useEffect(() => {
		fetchAllPoints();
	}, [fetchAllPoints]);

	useEffect(() => {
		if (bothSidesPoints.length === 0) return;

		const bounds: LatLngTuple[] = bothSidesPoints.map(
			(point) => [point.latitude, point.longitude] as LatLngTuple,
		);
		const comparisonMap = L.map(mapName, {
			scrollWheelZoom: false,
		});
		comparisonMap.fitBounds(bounds, { padding: [50, 50] });

		comparisonMap.createPane("left");
		comparisonMap.createPane("right");

		const attribution = `dCART | ${getMapAttribution(blockContent.content2_lang2)}`;

		const rightLayer = L.tileLayer(blockContent.content2_lang2, {
			pane: "right",
			attribution,
			opacity: 0.6,
		}).addTo(comparisonMap);

		const leftLayer = L.tileLayer(blockContent.content2_lang1, {
			pane: "left",
			attribution,
			opacity: 0.6,
		}).addTo(comparisonMap);

		// on créé les points sur chaque pane
		leftPoints.map((point) => {
			// on créé une icone adaptée au nombre de sources
			const icon = getIcon(point, style, false, true);

			const popupContent = point.nom_ville;
			L.marker([point.latitude, point.longitude], {
				pane: "left",
				shadowPane: "left",
				icon: icon,
			})
				.addTo(comparisonMap)
				.bindPopup(popupContent as string);
		});
		rightPoints.map((point) => {
			// on créé une icone adaptée au nombre de sources
			const icon = getIcon(point, style, false, true);

			const popupContent = point.nom_ville;
			L.marker([point.latitude, point.longitude], {
				pane: "right",
				shadowPane: "right",
				icon: icon,
			})
				.addTo(comparisonMap)
				.bindPopup(popupContent as string);
		});

		// on créé un point miniature sur le pane opposé
		rightPoints.map((point) => {
			L.marker([point.latitude, point.longitude], {
				pane: "left",
				shadowPane: "left",
				icon: getLittleCircleIcon(style),
			}).addTo(comparisonMap);
		});
		leftPoints.map((point) => {
			L.marker([point.latitude, point.longitude], {
				pane: "right",
				shadowPane: "right",
				icon: getLittleCircleIcon(style),
			}).addTo(comparisonMap);
		});

		L.control.sideBySide(leftLayer, rightLayer).addTo(comparisonMap);

		return () => {
			comparisonMap.remove();
		};
	}, [blockContent, leftPoints, rightPoints, mapName, bothSidesPoints]);

	// au montage, ajout d'un label aux boutons de zoom pour l'accessibilité
	useEffect(() => {
		const zoomIn = document.querySelector(".leaflet-control-zoom-in");
		const zoomOut = document.querySelector(".leaflet-control-zoom-out");

		if (zoomIn) zoomIn.setAttribute("aria-label", "Zoomer");
		if (zoomOut) zoomOut.setAttribute("aria-label", "Dézoomer");
	}, []);

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
