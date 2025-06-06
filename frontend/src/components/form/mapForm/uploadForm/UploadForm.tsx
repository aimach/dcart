// import des bibliothèques
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
// import des composants
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
// import du context
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { useShallow } from "zustand/shallow";
import PointSetUploadForm from "../pointSetUploadForm/PointSetUploadForm";
import { getOneMapInfosById } from "../../../../utils/api/builtMap/getRequests";
import { createPointSet } from "../../../../utils/api/builtMap/postRequests";
import { deletePointSet } from "../../../../utils/api/builtMap/deleteRequests";
import {
	updateMap,
	updatePointSet,
} from "../../../../utils/api/builtMap/putRequests";
import {
	notifyCreateSuccess,
	notifyDeleteSuccess,
	notifyEditSuccess,
	notifySuccessWithCustomMessage,
} from "../../../../utils/functions/toast";
import { getShapeForLayerName } from "../../../../utils/functions/icons";
// import des types
import type { FormEventHandler } from "react";
import type {
	MapColorType,
	MapIconType,
	MapInfoType,
	PointSetType,
} from "../../../../utils/types/mapTypes";
// import du style
import style from "../introForm/introForm.module.scss";
// import des images
import { CircleHelp, Pen, PlusCircle, X } from "lucide-react";

/**
 * Formulaire de la deuxième étape : upload de points sur la carte
 */
const UploadForm = () => {
	// récupération des données de la traduction
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { mapInfos, setMapInfos, step } = useMapFormStore(
		useShallow((state) => state),
	);

	// récupération des données de l'URL
	const { pathname } = useLocation();

	// définition d'un état pour afficher le bouton suivant si les points ont bien été uploadés, qui est caché par défaut en mode création
	const [nextButtonDisplayed, setNextButtonDisplayed] = useState(
		pathname.includes("edit"),
	);

	// fonction pour gérer la soumission du formulaire (passage à l'étape suivante)
	const [pointSet, setPointSet] = useState<PointSetType | null>(null);
	const [action, setAction] = useState<"create" | "edit">("create");
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		if (action === "create") {
			const newPointSet = await createPointSet(pointSet as PointSetType);
			if (newPointSet?.status === 201) {
				setIsAlreadyAPointSet(true);
				const mapWithPointSet = await getOneMapInfosById(
					mapInfos?.id as string,
				);
				setMapInfos(mapWithPointSet);
				notifyCreateSuccess("Jeu de points", false);
			}
		}
		if (action === "edit") {
			const newPointSet = await updatePointSet(pointSet as PointSetType);
			if (newPointSet?.status === 200) {
				const mapWithPointSet = await getOneMapInfosById(
					mapInfos?.id as string,
				);
				setMapInfos(mapWithPointSet);
				notifyEditSuccess("Jeu de points", false);
			}
		}
	};

	const [isAlreadyAPointSet, setIsAlreadyAPointSet] = useState(false);
	// biome-ignore lint/correctness/useExhaustiveDependencies: uniquement au montage
	useEffect(() => {
		if (mapInfos?.attestations) {
			setIsAlreadyAPointSet(true);
		}
		if (mapInfos?.attestations || isAlreadyAPointSet) {
			setNextButtonDisplayed(true);
		}
	}, [mapInfos]);

	const handleDeletePointSet = async (pointSetId: string) => {
		await deletePointSet(pointSetId as string);
		const newMapInfos = await getOneMapInfosById(mapInfos?.id as string);
		setMapInfos(newMapInfos);
		notifyDeleteSuccess("Jeu de points", false);
	};

	const handleUpdatePointSet = async (pointSetId: string) => {
		const pointSetToUpdate = mapInfos?.attestations.find(
			(pointSet) => pointSet.id === pointSetId,
		) as PointSetType;
		if (pointSetToUpdate) {
			setAction("edit");
			setPointSet({
				...pointSetToUpdate,
				mapId: mapInfos?.id as string,
				icon: (pointSetToUpdate.icon as MapIconType).id,
				color: (pointSetToUpdate.color as MapColorType).id,
			});
			setIsAlreadyAPointSet(false);
		}
	};

	const handleCheckboxChange = async (fieldName: string, boolean: string) => {
		const result = await updateMap({
			...(mapInfos as MapInfoType),
			[fieldName]: boolean === "true",
		});
		setMapInfos(result?.data);
		notifySuccessWithCustomMessage("Modification prise en compte");
	};

	return (
		<section className={style.uploadFormContainer}>
			<div className={style.titleAndHelpContainer}>
				<h4>{translation[language].backoffice.mapFormPage.addMapPoints}</h4>
				<div className={style.helpContainer}>
					<a
						href="https://regular-twilight-01d.notion.site/Pr-parer-le-CSV-importer-1bd4457ff831806f9291d5a75cfbcbb9?pvs=4"
						target="_blank"
						rel="noreferrer"
					>
						<CircleHelp color="grey" />
						{translation[language].backoffice.mapFormPage.uploadPointsHelp}
					</a>
				</div>
			</div>
			{isAlreadyAPointSet && (
				<ButtonComponent
					type="button"
					color="brown"
					textContent="Ajouter un nouveau jeu de points"
					onClickFunction={() => setIsAlreadyAPointSet(!isAlreadyAPointSet)}
					icon={<PlusCircle />}
				/>
			)}

			{!isAlreadyAPointSet && (
				<PointSetUploadForm
					pointSet={pointSet}
					setPointSet={setPointSet}
					handleSubmit={handleSubmit}
					parentId={mapInfos?.id as string}
					type="map"
					action={action}
					cancelFunction={() => {
						setPointSet(null);
						setIsAlreadyAPointSet(true);
						setAction("create");
					}}
				/>
			)}
			{mapInfos?.attestations && (
				<>
					<table className={style.pointSetTable}>
						<thead>
							<tr>
								<th scope="col">
									{
										translation[language].backoffice.mapFormPage.pointSetTable
											.name
									}
								</th>
								<th scope="col">
									{
										translation[language].backoffice.mapFormPage.pointSetTable
											.icon
									}
								</th>
								<th scope="col" />
							</tr>
						</thead>
						<tbody>
							{mapInfos.attestations.map((pointSet) => {
								const icon = getShapeForLayerName(
									(pointSet.icon as MapIconType)?.name_en,
									(pointSet.color as MapColorType)?.code_hex,
								);
								return (
									<tr key={pointSet.id} className={style.pointSetTableRow}>
										<td>{pointSet.name}</td>
										<td>
											<p
												// biome-ignore lint/security/noDangerouslySetInnerHtml: le HTML est généré par le code
												dangerouslySetInnerHTML={{
													__html: icon,
												}}
											/>
										</td>
										<td>
											<Pen
												onClick={() =>
													handleUpdatePointSet(pointSet.id as string)
												}
												onKeyDown={() =>
													handleUpdatePointSet(pointSet.id as string)
												}
											/>
											<X
												onClick={() =>
													handleDeletePointSet(pointSet.id as string)
												}
												onKeyDown={() =>
													handleDeletePointSet(pointSet.id as string)
												}
												color="#9d2121"
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					<div>
						{mapInfos?.attestations.length > 1 && (
							<div className={style.isLayeredContainer}>
								<input
									id="isLayered"
									name="isLayered"
									type="checkbox"
									onChange={(event) =>
										handleCheckboxChange(
											event.target.name,
											event.target.checked.toString(),
										)
									}
									defaultChecked={mapInfos.isLayered}
								/>
								<label htmlFor="isLayered">
									{
										translation[language].backoffice.mapFormPage.pointSetForm
											.isLayeredLabel
									}
								</label>
							</div>
						)}
						<div className={style.isLayeredContainer}>
							<input
								id="isNbDisplayed"
								name="isNbDisplayed"
								type="checkbox"
								onChange={(event) =>
									handleCheckboxChange(
										event.target.name,
										event.target.checked.toString(),
									)
								}
								defaultChecked={mapInfos.isNbDisplayed}
							/>
							<label htmlFor="isNbDisplayed">
								{
									translation[language].backoffice.mapFormPage.pointSetForm
										.isNbDisplayedLabel
								}
							</label>
						</div>
					</div>
				</>
			)}
			{isAlreadyAPointSet && (
				<NavigationButtonComponent
					step={step}
					nextButtonDisplayed={nextButtonDisplayed}
				/>
			)}
		</section>
	);
};

export default UploadForm;
