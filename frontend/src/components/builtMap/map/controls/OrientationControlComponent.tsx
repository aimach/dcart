// import des bibliothèques
import { useEffect } from "react";
import L from "leaflet";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import du type
import type { Map as LeafletMap } from "leaflet";
// import des images
import northIcon from "../../../../assets/icon-nord.png";

/**
 * Composant qui affiche une image d'indication du nord sur la carte
 * @param {Ojbect} props Les props du composant
 */
const OrientationControl = () => {
	const map = useMapStore((state) => state.map);

	useEffect(() => {
		const control = L.control({ position: "topleft" });

		// Contenu HTML du bouton
		control.onAdd = () => {
			const button = L.DomUtil.create("button", "custom-control-button");
			button.innerHTML = `<img src=${northIcon} alt="Orientation" width="70"/>`; // Chemin vers l'image d'orientation
			button.style.cursor = "pointer";

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

export default OrientationControl;
