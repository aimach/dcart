// import des bibliothèques
import { useContext, useState } from "react";
import { useLocation } from "react-router";
// import des composants
import SelectOptionsComponent from "../../../common/input/SelectOptionsComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
// import du contexte
import { IconOptionsContext } from "../../../../context/IconOptionsContext";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/map";
import { parseCSVFile } from "../../../../utils/functions/csv";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { notifyError } from "../../../../utils/functions/toast";
// import des types
import type { FormEvent, ChangeEvent } from "react";
import type {
	CustomPointType,
	MapIconType,
	PointSetType,
} from "../../../../utils/types/mapTypes";
import type { ParseResult } from "papaparse";
// import du style
import style from "../introForm/introForm.module.scss";
// import des icônes
import { CircleCheck, CircleX } from "lucide-react";

interface PointSetUploadFormProps {
	pointSet: PointSetType | null;
	setPointSet: (pointSet: PointSetType | null) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
	parentId: string;
	type: "map" | "block";
	action: "create" | "edit";
	cancelFunction: () => void;
}

const PointSetUploadForm = ({
	pointSet,
	setPointSet,
	handleSubmit,
	parentId,
	type,
	action,
	cancelFunction,
}: PointSetUploadFormProps) => {
	// récupération des données de la traduction
	const { translation, language } = useTranslation();

	const { icons, colors } = useContext(IconOptionsContext);

	const [DBSelectedFile, setDBSelectedFile] = useState<File | null>(null);
	const [CustomSelectedFile, setCustomDBSelectedFile] = useState<File | null>(
		null,
	);

	const location = useLocation();
	const isStorymap = location.pathname.includes("storymaps");

	const { storymapInfos } = useBuilderStore();

	const fileStatusTranslationObject =
		translation[language].backoffice.storymapFormPage.form.fileStatus;

	const handleBDDPointFileUpload = (event: ChangeEvent) => {
		parseCSVFile({
			event,
			onComplete: (result: ParseResult<{ id: string } | CustomPointType>) => {
				if (result.data.length === 0) {
					notifyError("Le fichier est vide ou mal formaté");
					return;
				}
				const allAttestationsIds = getAllAttestationsIdsFromParsedPoints(
					result.data as { id: string }[],
				);
				setPointSet({
					...pointSet,
					attestationIds: allAttestationsIds,
					[type === "map" ? "mapId" : "blockId"]: parentId as string,
				} as PointSetType);
				setDBSelectedFile(
					(event.target as HTMLInputElement).files?.[0] ?? null,
				);
			},
			onError: () => {
				notifyError(
					"Erreur lors du chargement du fichier. Vérifier le format.",
				);
			},
		});
	};

	const handleCustomPointFileUpload = (event: ChangeEvent) => {
		parseCSVFile({
			event,
			onComplete: (result: ParseResult<{ id: string } | CustomPointType>) => {
				setPointSet({
					...pointSet,
					customPointsArray: result.data as CustomPointType[],
					blockId: parentId as string,
				} as PointSetType);
				setCustomDBSelectedFile(
					(event.target as HTMLInputElement).files?.[0] ?? null,
				);
			},
			onError: () => {
				notifyError(
					"Erreur lors du chargement du fichier. Vérifier le format.",
				);
			},
			headerMapping: {
				latitude: "latitude",
				longitude: "longitude",
				location: "location",
				sourceNb: "source_nb",
			},
			skipLines: 0,
		});
	};

	return (
		icons.length && (
			<form onSubmit={handleSubmit} className={style.commonFormContainer}>
				<div className={style.commonFormInputContainer}>
					<LabelComponent
						htmlFor="name_fr"
						label={
							isStorymap
								? `${
										translation[language].backoffice.mapFormPage.pointSetTable
											.nameLang1
									} (${storymapInfos?.lang1?.name.toUpperCase()})`
								: translation[language].backoffice.mapFormPage.pointSetForm
										.pointSetName.label_fr
						}
						description={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointSetName.description_en
						}
					/>
					<div className={style.inputContainer}>
						<input
							id="name_fr"
							name="name_fr"
							type="text"
							defaultValue={pointSet?.name_fr ?? ""}
							onChange={(event) =>
								setPointSet({
									...pointSet,
									name_fr: event.target.value,
								} as PointSetType)
							}
						/>
					</div>
				</div>
				{(!isStorymap || storymapInfos?.lang2) && (
					<div className={style.commonFormInputContainer}>
						<LabelComponent
							htmlFor="name_en"
							label={
								isStorymap
									? `${
											translation[language].backoffice.mapFormPage.pointSetTable
												.nameLang2
										} (${storymapInfos?.lang2?.name.toUpperCase()})`
									: translation[language].backoffice.mapFormPage.pointSetForm
											.pointSetName.label_en
							}
							description={
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointSetName.description_en
							}
						/>
						<div className={style.inputContainer}>
							<input
								id="name_en"
								name="name_en"
								type="text"
								defaultValue={pointSet?.name_en ?? ""}
								onChange={(event) =>
									setPointSet({
										...pointSet,
										name_en: event.target.value,
									} as PointSetType)
								}
							/>
						</div>
					</div>
				)}
				<div className={style.commonFormInputContainer}>
					<LabelComponent
						htmlFor="attestationIds"
						label={
							translation[language].backoffice.mapFormPage.pointSetForm
								.attestationIds.label
						}
						description={
							translation[language].backoffice.mapFormPage.pointSetForm
								.attestationIds.description
						}
						isRequired={!isStorymap}
					/>
					<div className={style.inputContainer}>
						<input
							id="attestationIds"
							name="attestationIds"
							type="file"
							accept=".csv"
							onChange={handleBDDPointFileUpload}
						/>
						<p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
							{pointSet?.attestationIds ? (
								<CircleCheck color="green" />
							) : action === "edit" ? (
								<CircleX color="grey" />
							) : null}
							{DBSelectedFile
								? `${fileStatusTranslationObject.loadedFile} : ${DBSelectedFile?.name}`
								: pointSet?.attestationIds
									? fileStatusTranslationObject.fileAlreadyLoaded
									: fileStatusTranslationObject.noFile}
						</p>
					</div>
				</div>
				{isStorymap && (
					<div className={style.commonFormInputContainer}>
						<LabelComponent
							htmlFor="customPointsFile"
							label={
								translation[language].backoffice.mapFormPage.pointSetForm
									.customPointsFile.label
							}
							description={
								translation[language].backoffice.mapFormPage.pointSetForm
									.customPointsFile.description
							}
							isRequired={false}
						/>

						<div className={style.inputContainer}>
							<input
								id="customPointsFile"
								name="customPointsFile"
								type="file"
								accept=".csv"
								onChange={handleCustomPointFileUpload}
							/>
							<p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
								{pointSet?.customPointsArray &&
								pointSet?.customPointsArray?.length > 0 ? (
									<CircleCheck color="green" />
								) : action === "edit" ? (
									<CircleX color="grey" />
								) : null}
								{CustomSelectedFile
									? `${fileStatusTranslationObject.loadedFile} : ${CustomSelectedFile?.name}`
									: pointSet?.customPointsArray &&
											pointSet?.customPointsArray?.length > 0
										? fileStatusTranslationObject.fileAlreadyLoaded
										: fileStatusTranslationObject.noFile}
							</p>
						</div>
					</div>
				)}
				<div className={style.commonFormInputContainer}>
					<LabelComponent
						htmlFor="colorId"
						label={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointColor.label
						}
						description={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointColor.description
						}
						isRequired={false}
					/>
					<div className={style.inputContainer}>
						<SelectOptionsComponent
							selectId="colorId"
							basicOptionValue="null"
							basicOptionContent={
								translation[language].backoffice.mapFormPage.pointSetForm
									.chooseColor
							}
							options={[
								...colors,
								{
									code_hex: "null",
									id: "",
									name_fr: "icône par défaut",
									name_en: "default",
								},
							]}
							onChangeFunction={(event) =>
								setPointSet({
									...pointSet,
									color: event.target.value,
								} as PointSetType)
							}
							value={(pointSet?.color as string) ?? "null"}
						/>
					</div>
				</div>
				<div className={style.commonFormInputContainer}>
					<LabelComponent
						htmlFor="iconId"
						label={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointIcon.label
						}
						description={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointIcon.description
						}
						isRequired={false}
					/>
					<div className={style.inputContainer}>
						<SelectOptionsComponent
							selectId="iconId"
							basicOptionValue="null"
							basicOptionContent={
								translation[language].backoffice.mapFormPage.pointSetForm
									.chooseIcon
							}
							options={
								[
									...icons,
									{ id: "", name_fr: "défaut", name_en: "default" },
								] as MapIconType[]
							}
							onChangeFunction={(event) =>
								setPointSet({
									...pointSet,
									icon: event.target.value,
								} as PointSetType)
							}
							value={(pointSet?.icon as string) ?? "null"}
						/>
					</div>
				</div>
				<div className={style.buttonContainer}>
					<ButtonComponent
						type="submit"
						color="brown"
						textContent={
							translation[language].button[action === "create" ? "add" : "edit"]
						}
					/>
					{
						<ButtonComponent
							type="button"
							color="red"
							textContent={translation[language].button.cancel}
							onClickFunction={() => {
								cancelFunction();
								setDBSelectedFile(null);
								setCustomDBSelectedFile(null);
								setPointSet(null);
							}}
						/>
					}
				</div>
			</form>
		)
	);
};

export default PointSetUploadForm;
