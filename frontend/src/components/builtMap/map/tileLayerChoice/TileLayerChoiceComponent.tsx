// import des services
import { useShallow } from "zustand/shallow";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import du style
import style from "./tileLayerChoiceComponent.module.scss";

/**
 * Composant de choix du fond de carte
 */
const TileLayerChoiceComponent = () => {
	// source : https://leaflet-extras.github.io/leaflet-providers/preview/
	// définition des variables utiles pour l'affichage des tuiles
	// {s} : Sous-domaine aléatoire
	const subdomains = ["a", "b", "c"];
	const s = subdomains[Math.floor(Math.random() * subdomains.length)]; // définition d'un sous-domaine aléatoire
	// {z} : Niveau de zoom
	const z = 7;
	// {x}, {y} : Coordonnées de la tuile
	const x = 74;
	const y = 49;

	// liste du choix des tuiles (à déporter dans la BDD)
	const tileLayers = [
		{
			name: "Consortium of Ancient World Mappers",
			url: "https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png",
			urlMini: `https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/${z}/${x}/${y}.png`,
		},
		{
			name: "Open Street Map Basic",
			url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			urlMini: `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`,
		},
	];

	// récuépration des données du store
	const { tileLayerURL, setTileLayerURL } = useMapStore(
		useShallow((state) => state),
	);

	return (
		<div className={style.tileLayerChoiceContainer}>
			{tileLayers.map((tileLayer) => {
				const isSelected = tileLayerURL === tileLayer.url;
				return (
					<button
						key={tileLayer.name}
						type="button"
						className={`${style.tileLayerChoice} ${isSelected ? style.selected : ""}`}
						onClick={() => setTileLayerURL(tileLayer.url)}
						onKeyUp={() => setTileLayerURL(tileLayer.url)}
					>
						<img
							src={tileLayer.urlMini}
							alt={tileLayer.name}
							title={tileLayer.name}
							loading="lazy"
							width="100%"
							height="100%"
						/>
					</button>
				);
			})}
		</div>
	);
};

export default TileLayerChoiceComponent;
