// import des bibliothèques
import { useMemo } from "react";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des services
import { getBlendIcon } from "../../../../utils/functions/icons";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./simpleLayerChoice.module.scss";
import "./simpleLayerChoice.css";

type SimpleLayerComponentProps = {
	allMemoizedPoints: PointType[];
};

const SimpleLayerComponent = ({
	allMemoizedPoints,
}: SimpleLayerComponentProps) => {
	const allPointColorsAndShapes = useMemo(() => {
		const seenShapeAndColor = new Set();
		const uniqueShapeAndColor = [];
		for (const point of allMemoizedPoints) {
			const shapeAndColor = `${point.shape}-${point.color}`;
			if (!seenShapeAndColor.has(shapeAndColor)) {
				seenShapeAndColor.add(shapeAndColor);
				uniqueShapeAndColor.push(shapeAndColor);
			}
		}
		return uniqueShapeAndColor;
	}, [allMemoizedPoints]);

	const createClusterCustomIcon = () => {
		const blendIcon = getBlendIcon(allPointColorsAndShapes);
		return L.divIcon({
			html: `<div class="marker-cluster-custom">${blendIcon}</div>`,
			className: "",
			iconSize: L.point(32, 32, true),
		});
	};
	return (
		<MarkerClusterGroup
			spiderfyOnMaxZoom={true}
			spiderfyOnEveryZoom={true}
			showCoverageOnHover={false}
			disableClusteringAtZoom={12}
			maxClusterRadius={1}
			iconCreateFunction={createClusterCustomIcon}
		>
			{allMemoizedPoints.map((point: PointType) => (
				<MarkerComponent
					key={point.key}
					point={point}
					duplicatesCoordinates={[]}
				/>
			))}
		</MarkerClusterGroup>
	);
};

export default SimpleLayerComponent;
