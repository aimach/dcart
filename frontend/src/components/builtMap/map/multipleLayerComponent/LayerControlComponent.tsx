// import des bibliothèques
import { useEffect, useState } from "react";
import { LayersControl, LayerGroup } from "react-leaflet";
// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des services
import { getAllPointsForDemoMap } from "../../../../utils/api/builtMap/getRequests";
// import des types
import type { PointSetType, PointType } from "../../../../utils/types/mapTypes";
import type { Dispatch, SetStateAction } from "react";

type LayerControlComponentProps = {
	attestation: PointSetType;
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
};

const LayerControlComponent = ({
	attestation,
	setPanelDisplayed,
}: LayerControlComponentProps) => {
	const [allLayerPoints, setAllLayerPoints] = useState<PointType[]>([]);
	useEffect(() => {
		const fetchAllLayerPoints = async (attestationIds: string) => {
			const allPoints = await getAllPointsForDemoMap(attestationIds);
			setAllLayerPoints(allPoints);
		};
		fetchAllLayerPoints(attestation.attestationIds);
	}, [attestation.attestationIds]);
	return (
		<LayersControl.Overlay key={attestation.id} name={attestation.name} checked>
			<LayerGroup>
				{allLayerPoints.map((point) => {
					return (
						<MarkerComponent
							key={point.key}
							point={point}
							setPanelDisplayed={setPanelDisplayed}
						/>
					);
				})}
			</LayerGroup>
		</LayersControl.Overlay>
	);
};

export default LayerControlComponent;
