// import des bibliothèques
import { useEffect } from "react";
import L from "leaflet";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import du type
import type { LatLngTuple, Map as LeafletMap } from "leaflet";

interface ResetControlProps {
	mapBounds: LatLngTuple[];
}

/**
 * Composant de contrôle permettant de réinitialiser la vue de la carte
 * @param {Ojbect} props Les props du composant
 * @param {LatLngTuple[]} props.mapBounds Les limites de la carte
 */
const ResetControl = ({ mapBounds }: ResetControlProps) => {
	const map = useMapStore((state) => state.map);

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
