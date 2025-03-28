// import des composants
import MarkerComponent from "../MarkerComponent/MarkerComponent";
// import des types
import type { PointType } from "../../../../utils/types/mapTypes";
import type { Dispatch, SetStateAction } from "react";

type SimpleLayerComponentProps = {
	allMemoizedPoints: PointType[];
	setPanelDisplayed: Dispatch<SetStateAction<boolean>>;
};

const SimpleLayerComponent = ({
	allMemoizedPoints,
	setPanelDisplayed,
}: SimpleLayerComponentProps) => {
	return allMemoizedPoints.map((point: PointType) => {
		return (
			<MarkerComponent
				key={point.key}
				point={point}
				setPanelDisplayed={setPanelDisplayed}
				duplicatesCoordinates={[]}
			/>
		);
	});
};

export default SimpleLayerComponent;
