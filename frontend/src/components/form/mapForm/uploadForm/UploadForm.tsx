// import des bibliothèques
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
// import des composants
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
import PointSetUploadForm from "../pointSetUploadForm/PointSetUploadForm";
import ModalComponent from "../../../common/modal/ModalComponent";
import UpdatePointSetContent from "../../../common/modal/UpdatePointSetContent";
import TooltipComponent from "../../../common/tooltip/TooltipComponent";
// import du context
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { useShallow } from "zustand/shallow";
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
	notifyError,
} from "../../../../utils/functions/toast";
import { getShapeForLayerName } from "../../../../utils/functions/icons";
import { handleCSVDownload } from "../../../../utils/functions/csv";
// import des types
import type { FormEventHandler } from "react";
import type {
	MapColorType,
	MapIconType,
	MapInfoType,
	PointSetType,
} from "../../../../utils/types/mapTypes";
import { displayBrushCleaningButton } from "../../../../utils/functions/common";
// import du style
import style from "../introForm/introForm.module.scss";
// import des images et icônes
import {
	CircleAlert,
	CircleHelp,
	FileDown,
	Pen,
	PlusCircle,
	X,
} from "lucide-react";

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

	const [reload, setReload] = useState(false);

	// définition de l'état d'affichage de la modale
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [pointSetIdToClean, setPointSetIdToClean] = useState<string | null>(
		null,
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
	const isPointSetFormValid =
		pointSet?.name_fr &&
		pointSet.name_fr !== "" &&
		pointSet.name_en &&
		pointSet.name_en !== "" &&
		pointSet.attestationIds &&
		pointSet.attestationIds !== "";

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		if (!isPointSetFormValid) {
			notifyError(
				"Veuillez remplir tous les champs obligatoires du formulaire.",
			);
			return;
		}
		if (action === "create") {
			const newPointSet = await createPointSet(pointSet as PointSetType);
			if (newPointSet?.status === 201) {
				setIsAlreadyAPointSet(true);
				const mapWithPointSet = await getOneMapInfosById(
					mapInfos?.id as string,
				);
				setMapInfos(mapWithPointSet);
				notifyCreateSuccess("Jeu de points", false);
				setPointSet(null);
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
				setPointSet(null);
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

	const [isLayered, setIsLayered] = useState<boolean>(
		mapInfos?.isLayered ?? false,
	);
	const [isNbDisplayed, setIsNbDisplayed] = useState<boolean>(
		mapInfos?.isNbDisplayed ?? false,
	);
	const handleCheckboxChange = async (
		isLayered: boolean,
		isNbDisplayed: boolean,
	) => {
		const newMapInfos = await updateMap({
			...(mapInfos as MapInfoType),
			isLayered,
			isNbDisplayed,
		});
		setMapInfos({
			...mapInfos,
			isLayered: newMapInfos?.data.isLayered,
			isNbDisplayed: newMapInfos?.data.isNbDisplayed,
		} as MapInfoType);
	};

	return (
		<section className={style.uploadFormContainer} key={reload.toString()}>
			{isModalOpen && (
				<ModalComponent
					onClose={() => {
						setIsModalOpen(false);
					}}
				>
					<UpdatePointSetContent
						idToUpdate={pointSetIdToClean as string}
						setIsModalOpen={setIsModalOpen}
						reload={reload}
						setReload={setReload}
						mapType="map"
						pointType="bdd"
					/>
				</ModalComponent>
			)}
			<div className={style.titleAndHelpContainer}>
				<h4>{translation[language].backoffice.mapFormPage.addMapPoints}</h4>
				{isAlreadyAPointSet && (
					<ButtonComponent
						type="button"
						color="brown"
						textContent="Ajouter un nouveau jeu de points"
						onClickFunction={() => setIsAlreadyAPointSet(!isAlreadyAPointSet)}
						icon={<PlusCircle />}
					/>
				)}
			</div>
			<div className={style.helpContainer}>
				<a
					href="https://sharedocs.huma-num.fr/wl/?id=dJrDrFA2uDDRqqo5PGnmnkNzaNpFWSEW&fmode=open"
					target="_blank"
					rel="noreferrer"
				>
					<CircleHelp color="grey" />
					{translation[language].backoffice.mapFormPage.uploadPointsHelp}
				</a>
			</div>
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
											.nameLang1
									}
								</th>
								<th scope="col">
									{
										translation[language].backoffice.mapFormPage.pointSetTable
											.nameLang2
									}
								</th>
								<th scope="col">
									{
										translation[language].backoffice.mapFormPage.pointSetTable
											.icon
									}
								</th>
								<th>
									{
										translation[language].backoffice.mapFormPage.pointSetTable
											.downloadCSV
									}
								</th>
								<th>
									{
										translation[language].backoffice.mapFormPage.pointSetTable
											.lastActivity
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
									<>
										<tr key={pointSet.id} className={style.pointSetTableRow}>
											<td>{pointSet.name_fr}</td>
											<td>{pointSet.name_en}</td>
											<td>
												<p
													// biome-ignore lint/security/noDangerouslySetInnerHtml: le HTML est généré par le code
													dangerouslySetInnerHTML={{
														__html: icon,
													}}
												/>
											</td>
											<td>
												{pointSet?.attestationIds ? (
													<FileDown
														onClick={() =>
															handleCSVDownload(
																pointSet,
																`${pointSet.name_fr}.csv`,
																"mapPoints",
															)
														}
														cursor={
															pointSet?.attestationIds
																? "pointer"
																: "not-allowed"
														}
														color={pointSet?.attestationIds ? "black" : "grey"}
													/>
												) : (
													<p style={{ textAlign: "center" }}>
														<CircleAlert color="#9d2121" />{" "}
														<p style={{ color: "#9d2121" }}>
															{
																translation[language].backoffice
																	.noPointInPointSet
															}
														</p>
													</p>
												)}
											</td>
											<td>
												{pointSet.lastActivity
													? new Date(pointSet.lastActivity).toLocaleDateString(
															language,
															{
																year: "numeric",
																month: "long",
																day: "numeric",
															},
														)
													: null}
											</td>
											<td>
												<TooltipComponent
													text={translation[language].button.clean}
												>
													{displayBrushCleaningButton(
														pointSet.id as string,
														pointSet.attestationIds === "",
														setPointSetIdToClean,
														setIsModalOpen,
													)}
												</TooltipComponent>
												<TooltipComponent
													text={translation[language].button.edit}
												>
													<Pen
														onClick={() =>
															handleUpdatePointSet(pointSet.id as string)
														}
														onKeyDown={() =>
															handleUpdatePointSet(pointSet.id as string)
														}
													/>
												</TooltipComponent>
												<TooltipComponent
													text={translation[language].button.delete}
												>
													<X
														onClick={() =>
															handleDeletePointSet(pointSet.id as string)
														}
														onKeyDown={() =>
															handleDeletePointSet(pointSet.id as string)
														}
														color="#9d2121"
													/>
												</TooltipComponent>
											</td>
										</tr>
									</>
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
									onChange={(event) => setIsLayered(event.target.checked)}
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
								onChange={(event) => setIsNbDisplayed(event.target.checked)}
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
					onChangeFunction={() => {
						handleCheckboxChange(isLayered, isNbDisplayed);
					}}
				/>
			)}
		</section>
	);
};

export default UploadForm;
