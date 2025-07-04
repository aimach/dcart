// import des bibliothèques
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import ButtonComponent from "../../common/button/ButtonComponent";
import ItemTableComponent from "../itemTable/ItemTableComponent";
import LoaderComponent from "../../common/loader/LoaderComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import {
	handleGetMyItemsInManagementTable,
	handleResetInManagementTable,
	handleSearchInManagementTable,
} from "./managementContainerUtils";
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

type ManagementContainerProps = {
	type: string;
};

const ManagementContainer = ({ type }: ManagementContainerProps) => {
	const navigate = useNavigate();

	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { reload } = useModalStore();
	const { resetMapInfos } = useMapFormStore();

	const { register, handleSubmit, resetField, watch } = useForm<{
		searchText: string;
	}>();

	const [allMapsInfos, setAllMapsInfos] = useState<MapType[]>([]);
	const [allStorymapsInfos, setAllStorymapsInfos] = useState<MapType[]>([]);
	const [isMyItems, setIsMyItems] = useState<boolean>(false);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	// fonction pour charger les informations des cartes
	const fetchAllMapsInfos = useCallback(
		async (searchText: string, myItems: boolean) => {
			const maps = await getAllMapsInfos(false, searchText, myItems);
			setAllMapsInfos(maps);
			setIsLoaded(true);
		},
		[],
	);
	// fonction pour charger les informations des storymaps
	const fetchAllStorymapsInfos = useCallback(
		async (searchText: string, myItems: boolean) => {
			const storymaps = await getAllStorymapsInfos(false, searchText, myItems);
			setAllStorymapsInfos(storymaps);
			setIsLoaded(true);
		},
		[],
	);
	// biome-ignore lint/correctness/useExhaustiveDependencies: permet de recharger les données à chaque changement sur la page (suppression, changement de statut)
	useEffect(() => {
		if (type === "map") {
			fetchAllMapsInfos("", isMyItems);
		}
		if (type === "storymap") {
			fetchAllStorymapsInfos("", isMyItems);
		}
	}, [type, reload, fetchAllMapsInfos, fetchAllStorymapsInfos]);

	return (
		<>
			<section className={style.managementContainer}>
				<div className={style.managementHeader}>
					<div className={style.buttonContainer}>
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
					</div>
					<div className={style.searchContainer}>
						<ButtonComponent
							type="button"
							color="brown"
							textContent={
								isMyItems
									? translation[language].button.allCreations
									: translation[language].button.myCreations
							}
							onClickFunction={() =>
								handleGetMyItemsInManagementTable(
									type,
									isMyItems,
									setIsMyItems,
									watch,
									fetchAllMapsInfos,
									fetchAllStorymapsInfos,
								)
							}
						/>
						<form
							onSubmit={handleSubmit((data) =>
								handleSearchInManagementTable(
									data,
									type,
									isMyItems,
									fetchAllMapsInfos,
									fetchAllStorymapsInfos,
								),
							)}
						>
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
								onClickFunction={() =>
									handleResetInManagementTable(
										type,
										isMyItems,
										fetchAllMapsInfos,
										fetchAllStorymapsInfos,
										resetField,
									)
								}
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
										{translation[language].backoffice.managementTable.createdBy}
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
