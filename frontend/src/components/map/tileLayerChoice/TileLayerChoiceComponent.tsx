// import des bibliothèques
// import des composants
// import du context
// import des services
import { useShallow } from "zustand/shallow";
import { useMapStore } from "../../../utils/stores/mapStore";
// import des types
// import du style
import style from "./tileLayerChoiceComponent.module.scss";

const TileLayerChoiceComponent = () => {
	// source : https://leaflet-extras.github.io/leaflet-providers/preview/
	// {z} : Niveau de zoom.
	// {x}, {y} : Coordonnées de la tuile
	// {r} : Optionnel. Version en fonction résolution de l'écran
	const z = 7;
	const x = 74;
	const y = 49;
	const subdomains = ["a", "b", "c"];
	const s = subdomains[Math.floor(Math.random() * subdomains.length)]; // on récupère un sous-domaine aléatoire

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
		{
			name: "Stamen Toner Background",
			url: "https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}{r}.png",
			urlMini: `https://tiles.stadiamaps.com/tiles/stamen_toner_background/${z}/${x}/${y}.png`,
		},
		{
			name: "Stamen Watercolor",
			url: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.png",
			urlMini: `https://tiles.stadiamaps.com/tiles/stamen_watercolor/${z}/${x}/${y}.png`,
		},
	];

	// on récupère les données du store
	const { tileLayerURL, setTileLayerURL } = useMapStore(
		useShallow((state) => ({
			tileLayerURL: state.tileLayerURL,
			setTileLayerURL: state.setTileLayerURL,
		})),
	);

	return (
		<div className={style.tileLayerChoiceContainer}>
			{tileLayers.map((tileLayer) => (
				<div
					key={tileLayer.name}
					className={style.tileLayerChoice}
					// style={{
					// 	backgroundImage: `url(${tileLayer.urlMini})`,
					// }}
					onClick={() => setTileLayerURL(tileLayer.url)}
					onKeyUp={() => setTileLayerURL(tileLayer.url)}
				>
					<img
						src={tileLayer.urlMini}
						alt={tileLayer.name}
						title={tileLayer.name}
					/>
				</div>
			))}
		</div>
	);
};

export default TileLayerChoiceComponent;
