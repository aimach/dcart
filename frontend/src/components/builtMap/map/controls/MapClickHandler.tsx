// import des bibliothèques
import { useEffect } from "react";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";

type MapClickHandlerProps = {
	deselectFunction: () => void;
};

const MapClickHandler = ({ deselectFunction }: MapClickHandlerProps) => {
	const { map } = useMapStore();

	useEffect(() => {
		if (!map) return;
		const handleClick = (e) => {
			if (!e.originalEvent._stopped) {
				deselectFunction();
			}
		};

		map.on("click", handleClick);

		return () => {
			map.off("click", handleClick);
		};
	}, [map, deselectFunction]);

	return null;
};

export default MapClickHandler;
