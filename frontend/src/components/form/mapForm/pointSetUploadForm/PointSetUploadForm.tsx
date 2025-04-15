// import des bibliothèques
import { useContext } from "react";
import { parse } from "papaparse";
// import du contexte
import { IconOptionsContext } from "../../../../context/IconOptionsContext";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/map";
// import des types
import type { FormEvent, ChangeEvent } from "react";
import type { ParseResult } from "papaparse";
import type {
	ParsedPointType,
	PointSetType,
} from "../../../../utils/types/mapTypes";
// import du style
import style from "../introForm/introForm.module.scss";
import { notifyUploadSuccess } from "../../../../utils/functions/toast";

interface PointSetUploadFormProps {
	pointSet: PointSetType | null;
	setPointSet: (pointSet: PointSetType) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
	parentId: string;
	type: "map" | "block";
}

const PointSetUploadForm = ({
	pointSet,
	setPointSet,
	handleSubmit,
	parentId,
	type,
}: PointSetUploadFormProps) => {
	// récupération des données de la traduction
	const { translation, language } = useTranslation();

	const { icons, colors } = useContext(IconOptionsContext)

	// fonction pour gérer l'upload du fichier
	const handleFileUpload = (event: ChangeEvent) => {
		// définition de la correspondance avec les headers du csv
		const headerMapping: Record<string, string> = {
			ID: "id",
		};

		const file = (event.target as HTMLInputElement).files?.[0];
		// s'il existe bien un fichier, les données sont parsées et les points sont ajoutés à la carte de démonstration
		if (file) {
			// @ts-ignore : l'erreur de type sur File, le fichier est bien de type File (problème de typage avec l'utilisation de l'option skipFirstNLines)
			parse(file, {
				header: true,
				transformHeader: (header) => headerMapping[header] || header,
				skipEmptyLines: true,
				dynamicTyping: true, // option qui permet d'avoir les chiffres et booléens en tant que tels
				skipFirstNLines: 2,
				complete: (result: ParseResult<ParsedPointType>) => {
					// récupération des ids des attestations
					const allAttestationsIds = getAllAttestationsIdsFromParsedPoints(
						result.data,
					);
					setPointSet({
						...pointSet,
						attestationIds: allAttestationsIds,
						[type === "map" ? "mapId" : "blockId"]: parentId as string,
					} as PointSetType);
					notifyUploadSuccess("Points");
				},
				error: (error) => {
					console.error("Erreur lors de la lecture du fichier :", error);
				},
			});
		}
	};

	return (
		icons.length && (
			<form onSubmit={handleSubmit} className={style.commonFormContainer}>
				<div className={style.commonFormInputContainer}>
					<div className={style.labelContainer}>
						<label htmlFor="name">
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointSetName.label
							}
						</label>
						<p>
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointSetName.description
							}
						</p>
					</div>
					<div className={style.inputContainer}>
						<input
							id="name"
							name="name"
							type="text"
							onChange={(event) =>
								setPointSet({
									...pointSet,
									name: event.target.value,
								} as PointSetType)
							}
						/>
					</div>
				</div>
				<div className={style.commonFormInputContainer}>
					<div className={style.labelContainer}>
						<label htmlFor="attestationIds">
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.attestationIds.label
							}
						</label>
						<p>
							{" "}
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.attestationIds.description
							}
						</p>
					</div>
					<div className={style.inputContainer}>
						<input
							id="attestationIds"
							name="attestationIds"
							type="file"
							accept=".csv"
							onChange={handleFileUpload}
						/>
					</div>
				</div>
				<div className={style.commonFormInputContainer}>
					<div className={style.labelContainer}>
						<label htmlFor="colorId">
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointIcon.label
							}
						</label>
						<p>
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointIcon.description
							}
						</p>
					</div>
					<div className={style.inputContainer}>
						<select
							name="colorId"
							id="colorId"
							onChange={(event) =>
								setPointSet({
									...pointSet,
									color: event.target.value,
								} as PointSetType)
							}
						>
							<option value="null">
								{
									translation[language].backoffice.mapFormPage.pointSetForm
										.chooseColor
								}
							</option>
							{colors.map((color) => (
								<option key={color.id} value={color.id}>
									{color[`name_${language}`]}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className={style.commonFormInputContainer}>
					<div className={style.labelContainer}>
						<label htmlFor="color">
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointIcon.label
							}
						</label>
						<p>
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointIcon.description
							}
						</p>
					</div>
					<div className={style.inputContainer}>
						<select
							name="iconId"
							id="iconId"
							onChange={(event) =>
								setPointSet({
									...pointSet,
									icon: event.target.value,
								} as PointSetType)
							}
						>
							<option value="null">
								{
									translation[language].backoffice.mapFormPage.pointSetForm
										.chooseIcon
								}
							</option>
							{icons.map((icon) =>
							(
								<option key={icon.id} value={icon.id}>
									{icon[`name_${language}`]}
								</option>
							)
							)}
						</select>
					</div>
				</div>
				<button type="submit" className={style.commonFormButton}>
					{translation[language].button.add}
				</button>
			</form>
		)
	);
};

export default PointSetUploadForm;
