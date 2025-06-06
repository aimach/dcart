// import des bibliothèques
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
// import des composants
import ButtonComponent from "../../common/button/ButtonComponent";
import ItemTableComponent from "../itemTable/ItemTableComponent";
import LoaderComponent from "../../common/loader/LoaderComponent";
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
// import des icônes
import { CirclePlus, ListRestart } from "lucide-react";
import { useForm } from "react-hook-form";

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
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	// chargement des informations des cartes au montage du composant

	// fonction pour charger les informations des cartes
	const fetchAllMapsInfos = useCallback(async (searchText: string) => {
		const maps = await getAllMapsInfos(false, searchText);
		setAllMapsInfos(maps);
		setIsLoaded(true);
	}, []);
	const fetchAllStorymapsInfos = useCallback(async (searchText: string) => {
		const storymaps = await getAllStorymapsInfos(false, searchText);
		setAllStorymapsInfos(storymaps);
		setIsLoaded(true);
	}, []);
	// biome-ignore lint/correctness/useExhaustiveDependencies: permet de recharger les données à chaque changement sur la page (suppression, changement de statut)
	useEffect(() => {
		if (type === "map") {
			fetchAllMapsInfos("");
		}
		if (type === "storymap") {
			fetchAllStorymapsInfos("");
		}
	}, [type, reload, fetchAllMapsInfos, fetchAllStorymapsInfos]);

	const { register, handleSubmit, resetField, watch } = useForm<{
		searchText: string;
	}>();

	const handleSearch = (data: { searchText: string }) => {
		if (type === "map") {
			fetchAllMapsInfos(data.searchText);
		}
		if (type === "storymap") {
			fetchAllStorymapsInfos(data.searchText);
		}
	};

	const handleReset = () => {
		if (type === "map") {
			fetchAllMapsInfos("");
		}
		if (type === "storymap") {
			fetchAllStorymapsInfos("");
		}
		resetField("searchText");
	};

	return (
		<>
			<section className={style.managementContainer}>
				<div className={style.managementHeader}>
					<ButtonComponent
						type="button"
						color="brown"
						textContent={`${translation[language].backoffice.createA} ${translation[language].common[type === "map" ? "map" : "storymap"]}`}
						onClickFunction={() => {
							navigate(`/backoffice/${type}s/create`);
							resetMapInfos();
						}}
						icon={<CirclePlus />}
					/>
					<div className={style.searchContainer}>
						<form onSubmit={handleSubmit(handleSearch)}>
							<input
								type="text"
								{...register("searchText")}
								placeholder={`${translation[language].button.search}...`}
							/>
							<ButtonComponent
								type="submit"
								color="brown"
								textContent={translation[language].button.search}
							/>
						</form>
						{watch("searchText") && (
							<ButtonComponent
								type="button"
								color="brown"
								textContent=""
								onClickFunction={handleReset}
								icon={<ListRestart />}
							/>
						)}
					</div>
				</div>
				<table className={style.managementTable}>
					{!isLoaded ? (
						<div className={style.loaderContainer}>
							<LoaderComponent size={50} />
						</div>
					) : (
						<>
							<thead>
								<tr>
									<th scope="col">
										{translation[language].backoffice.managementTable.image}
									</th>
									<th scope="col">
										{translation[language].backoffice.managementTable.name}
									</th>
									<th scope="col">
										{translation[language].backoffice.managementTable.status}
									</th>
									<th scope="col">
										{translation[language].backoffice.managementTable.createdOn}
									</th>
									<th scope="col">
										{translation[language].backoffice.managementTable.updatedOn}
									</th>
									<th scope="col">
										{
											translation[language].backoffice.managementTable
												.lastUploadBy
										}
									</th>
									<th scope="col">
										{translation[language].backoffice.managementTable.links}
									</th>
								</tr>
							</thead>
							<tbody>
								{type === "map"
									? allMapsInfos.map((map) => (
											<ItemTableComponent
												key={map.id}
												itemInfos={map}
												type="map"
											/>
										))
									: allStorymapsInfos.map((storymap) => (
											<ItemTableComponent
												key={storymap.id}
												itemInfos={storymap}
												type="storymap"
											/>
										))}
							</tbody>
						</>
					)}
				</table>
			</section>
		</>
	);
};

export default ManagementContainer;
