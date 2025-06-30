// import des bibliothèques
import { useContext, useState } from "react";
import { useLocation } from "react-router";
// import des composants
import SelectOptionsComponent from "../../../common/input/SelectOptionsComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
import ErrorComponent from "../../errorComponent/ErrorComponent";
// import du contexte
import { IconOptionsContext } from "../../../../context/IconOptionsContext";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/map";
import { parseCSVFile } from "../../../../utils/functions/csv";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
// import des types
import type { FormEvent, ChangeEvent } from "react";
import type {
	MapIconType,
	PointSetType,
} from "../../../../utils/types/mapTypes";
// import du style
import style from "../introForm/introForm.module.scss";
// import des icônes
import { CircleCheck } from "lucide-react";
import { notifyError } from "../../../../utils/functions/toast";

interface PointSetUploadFormProps {
	pointSet: PointSetType | null;
	setPointSet: (pointSet: PointSetType) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
	parentId: string;
	type: "map" | "block";
	action: "create" | "edit";
	cancelFunction: () => void;
	isPointSetFormValid: boolean | null;
}

const PointSetUploadForm = ({
	pointSet,
	setPointSet,
	handleSubmit,
	parentId,
	type,
	action,
	cancelFunction,
	isPointSetFormValid,
}: PointSetUploadFormProps) => {
	// récupération des données de la traduction
	const { translation, language } = useTranslation();

	const { icons, colors } = useContext(IconOptionsContext);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const location = useLocation();
	const isStorymap = location.pathname.includes("storymaps");

	const { storymapInfos } = useBuilderStore();

	const handleFileUpload = (event: ChangeEvent) => {
		parseCSVFile({
			event,
			onComplete: (result) => {
				const allAttestationsIds = getAllAttestationsIdsFromParsedPoints(
					result.data,
				);
				setPointSet({
					...pointSet,
					attestationIds: allAttestationsIds,
					[type === "map" ? "mapId" : "blockId"]: parentId as string,
				} as PointSetType);
				setSelectedFile((event.target as HTMLInputElement).files?.[0] ?? null);
			},
			onError: () => {
				notifyError(
					"Erreur lors du chargement du fichier. Vérifier le format.",
				);
			},
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
						{(!pointSet?.name_fr || pointSet?.name_fr === "") && (
							<ErrorComponent message="requis" />
						)}
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
							{(!pointSet?.name_en || pointSet?.name_en === "") && (
								<ErrorComponent message="requis" />
							)}
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
					/>

					<div className={style.inputContainer}>
						<input
							id="attestationIds"
							name="attestationIds"
							type="file"
							accept=".csv"
							onChange={handleFileUpload}
						/>
						<p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
							{((action === "create" && pointSet?.attestationIds) ||
								action === "edit") && <CircleCheck color="green" />}
							{action === "create" &&
								pointSet?.attestationIds &&
								`Fichier chargé : ${selectedFile?.name}`}
							{action === "edit" &&
								!selectedFile &&
								"Un fichier est déjà chargé"}
							{action === "edit" &&
								selectedFile &&
								`Nouveau fichier chargé : ${selectedFile?.name}`}
						</p>
						{(!pointSet?.attestationIds || pointSet?.attestationIds === "") && (
							<ErrorComponent message="requis" />
						)}
					</div>
				</div>
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
				<ButtonComponent
					type="submit"
					color="brown"
					textContent={
						translation[language].button[action === "create" ? "add" : "edit"]
					}
				/>

				{action === "edit" && (
					<ButtonComponent
						type="button"
						color="red"
						textContent={translation[language].button.cancel}
						onClickFunction={() => {
							cancelFunction();
							setSelectedFile(null);
							setPointSet(null);
						}}
					/>
				)}
			</form>
		)
	);
};

export default PointSetUploadForm;
