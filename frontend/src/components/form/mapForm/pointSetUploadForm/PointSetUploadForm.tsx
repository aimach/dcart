// import des bibliothèques
import { useEffect, useState } from "react";
import { parse } from "papaparse";
// import des composants
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { useShallow } from "zustand/shallow";
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/map";
import { getAllIcons } from "../../../../utils/api/builtMap/getRequests";
// import des types
import type { FormEvent, ChangeEvent } from "react";
import type { ParseResult } from "papaparse";
import type {
	MapIconType,
	MapInfoType,
	ParsedPointType,
	PointSetType,
} from "../../../../utils/types/mapTypes";
// import du style
import style from "../introForm/introForm.module.scss";

interface PointSetUploadFormProps {
	pointSet: PointSetType | null;
	setPointSet: (pointSet: PointSetType) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const PointSetUploadForm = ({
	pointSet,
	setPointSet,
	handleSubmit,
}: PointSetUploadFormProps) => {
	// récupération des données de la traduction
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { mapInfos } = useMapFormStore(useShallow((state) => state));

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
						mapId: mapInfos?.id as string,
					} as PointSetType);
				},
				error: (error) => {
					console.error("Erreur lors de la lecture du fichier :", error);
				},
			});
		}
	};

	const [allIcons, setAllIcons] = useState<MapIconType[]>([]);
	useEffect(() => {
		const fetchAllIcons = async () => {
			const fetchedIcons = await getAllIcons();
			setAllIcons(fetchedIcons);
		};
		fetchAllIcons();
	}, []);

	return (
		allIcons.length && (
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
						<label htmlFor="color">
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointColor.label
							}
						</label>
						<p>
							{" "}
							{
								translation[language].backoffice.mapFormPage.pointSetForm
									.pointColor.description
							}
						</p>
					</div>
					<div className={style.inputContainer}>
						<input
							id="color"
							name="color"
							type="color"
							onChange={(event) =>
								setPointSet({
									...pointSet,
									color: event.target.value,
								} as PointSetType)
							}
						/>
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
							{allIcons.map((icon) => (
								<option key={icon.id} value={icon.id}>
									{icon.name}
								</option>
							))}
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
