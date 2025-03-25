// import des bibliothèques
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// import des composants
import ButtonComponent from "../../common/button/ButtonComponent";
import ManagementItem from "../managementItem/ManagementItem";
// import des services
import {
	getAllMapsInfos,
	getAllStorymapsInfos,
} from "../../../utils/api/builtMap/getRequests";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import { useMapFormStore } from "../../../utils/stores/builtMap/mapFormStore";
// import des types
import type { MapType } from "../../../utils/types/mapTypes";
// import du style
import style from "./managementContainer.module.scss";

type ManagementContainerProps = {
	type: string;
};

const ManagementContainer = ({ type }: ManagementContainerProps) => {
	const navigate = useNavigate();

	// récupération des données des stores
	const { reload } = useModalStore();
	const { resetMapInfos } = useMapFormStore();

	// état pour stocker les informations des cartes
	const [allMapsInfos, setAllMapsInfos] = useState<MapType[]>([]);
	const [allStorymapsInfos, setAllStorymapsInfos] = useState<MapType[]>([]);

	// chargement des informations des cartes au montage du composant
	// biome-ignore lint/correctness/useExhaustiveDependencies: permet de recharger les données à chaque changement sur la page (suppression, changement de statut)
	useEffect(() => {
		// fonction pour charger les informations des cartes
		const fetchAllMapsInfos = async () => {
			const maps = await getAllMapsInfos();
			setAllMapsInfos(maps);
		};
		const fetchAllStorymapsInfos = async () => {
			const storymaps = await getAllStorymapsInfos();
			setAllStorymapsInfos(storymaps);
		};
		if (type === "map") {
			fetchAllMapsInfos();
		}
		if (type === "storymap") {
			fetchAllStorymapsInfos();
		}
	}, [type, reload]);

	const textKey = type === "map" ? "cartes" : "storymaps";

	return (
		<>
			<h2 className={style.managementContainerTitle}>Gestion des {textKey}</h2>
			<ButtonComponent
				type="button"
				color="gold"
				textContent={`Créer une ${textKey.slice(0, -1)}`}
				onClickFunction={() => {
					navigate(`/backoffice/${type}s/create`);
					resetMapInfos();
				}}
			/>
			<section className={style.managementContainerList}>
				{type === "map" ? (
					<ul className={style.managementContainerList}>
						{allMapsInfos.map((map) => (
							<ManagementItem
								key={map.id}
								itemInfos={map as MapType}
								type="map"
							/>
						))}
					</ul>
				) : (
					<ul className={style.managementContainerList}>
						{allStorymapsInfos.map((storymap) => (
							<ManagementItem
								key={storymap.id}
								itemInfos={storymap as MapType}
								type="storymap"
							/>
						))}
					</ul>
				)}
			</section>
		</>
	);
};

export default ManagementContainer;
