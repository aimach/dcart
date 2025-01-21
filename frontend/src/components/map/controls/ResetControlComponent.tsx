// import des bibliothèques
import { useContext, useEffect } from "react";
import L from "leaflet";
// import du context
import { MapContext } from "../../../context/MapContext";
// import du type
import type { LatLngTuple, Map as LeafletMap } from "leaflet";

interface ResetControlProps {
	mapBounds: LatLngTuple[];
}

// Composant pour ajouter un contrôle personnalisé
const ResetControl = ({ mapBounds }: ResetControlProps) => {
	const { map } = useContext(MapContext);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const control = L.control({ position: "topright" });

		// Contenu HTML du bouton
		control.onAdd = () => {
			const button = L.DomUtil.create("button", "custom-control-button");
			button.innerHTML = "Reset";
			button.style.cursor = "pointer";

			// Action à effectuer lors du clic
			button.onclick = () => {
				map?.fitBounds(mapBounds);
			};

			return button;
		};

		control.addTo(map); // Ajouter le contrôle à la carte

		return () => {
			// Nettoyage lors du démontage du composant
			(map as LeafletMap).removeControl(control);
		};
	}, [map]);

	return null;
};

export default ResetControl;
