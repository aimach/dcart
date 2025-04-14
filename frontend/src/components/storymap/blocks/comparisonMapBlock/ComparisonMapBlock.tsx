// import des bibliothèques
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import L from "leaflet";
// import des services
import {
	getIcon,
} from "../../../../utils/functions/icons";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type {
	BlockContentType,
} from "../../../../utils/types/storymapTypes";
import type { LatLngTuple } from "leaflet";
import type { PointType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./comparisonMapBloc.module.scss";
import "./comparisonMapBloc.css";
import "leaflet/dist/leaflet.css";
import "leaflet-side-by-side";
import { getAllPointsByBlockId } from "../../../../utils/api/builtMap/getRequests";

interface ComparisonMapBlockProps {
	blockContent: BlockContentType;
}

const ComparisonMapBlock = ({ blockContent }: ComparisonMapBlockProps) => {
	// récupération des données des stores
	const { selectedLanguage } = useStorymapLanguageStore();

	const mapName = useMemo(() => `comparison-map-${uuidv4}`, []);

	const [leftPoints, setLeftPoints] = useState<PointType[]>([]);
	const [rightPoints, setRightPoints] = useState<PointType[]>([]);
	const [bothSidesPoints, setBothSidesPoints] = useState<PointType[]>([]);

	const fetchAllPoints = useCallback(async () => {
		const leftPointsArray = await getAllPointsByBlockId(blockContent.id, "left");
		const rightPointsArray = await getAllPointsByBlockId(blockContent.id, "right");
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
		leftPoints.map((point) => {
			// on créé une icone adaptée au nombre de sources
			const icon = getIcon(
				point,
				style,
				false,
				true,
			);

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
			const icon = getIcon(
				point,
				style,
				false,
				true,
			);

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
		// (blockContent.groupedPoints as GroupedTyped[]).map((point) => {
		// 	L.marker([point.latitude, point.longitude], {
		// 		pane: point.pane === "left" ? "right" : "left",
		// 		shadowPane: point.pane === "left" ? "right" : "left",
		// 		icon: getLittleCircleIcon(style),
		// 	}).addTo(comparisonMap);
		// });

		L.control.sideBySide(leftLayer, rightLayer).addTo(comparisonMap);

		return () => {
			comparisonMap.remove();
		};
	}, [blockContent, leftPoints, rightPoints, mapName]);

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
