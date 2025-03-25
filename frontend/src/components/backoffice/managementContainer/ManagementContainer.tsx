// import des bibliothèques
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// import des composants
import ButtonComponent from "../../common/button/ButtonComponent";
import ItemTableComponent from "../itemTable/ItemTableComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
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

	const { translation, language } = useTranslation();

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

	return (
		<>
			<ButtonComponent
				type="button"
				color="gold"
				textContent={`+ ${translation[language].backoffice.createA} ${translation[language].common[type]}`}
				onClickFunction={() => {
					navigate(`/backoffice/${type}s/create`);
					resetMapInfos();
				}}
			/>
			<section className={style.managementContainer}>
				<table className={style.managementTable}>
					<thead>
						<tr>
							<th scope="col">Image</th>
							<th scope="col">Nom</th>
							<th scope="col">Description</th>
							<th scope="col">Statut</th>
							<th scope="col">Date de création</th>
							<th scope="col">Date de modification</th>
							<th scope="col">Liens rapides</th>
						</tr>
					</thead>
					<tbody>
						{type === "map"
							? allMapsInfos.map((map) => (
									<ItemTableComponent key={map.id} itemInfos={map} type="map" />
								))
							: allStorymapsInfos.map((storymap) => (
									<ItemTableComponent
										key={storymap.id}
										itemInfos={storymap}
										type="storymap"
									/>
								))}
					</tbody>
				</table>
			</section>
		</>
	);
};

export default ManagementContainer;
