// import des bibliothèques
import { useContext } from "react";
// import des composants
import SelectOptionsComponent from "../../../common/input/SelectOptionsComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
// import du contexte
import { IconOptionsContext } from "../../../../context/IconOptionsContext";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/map";
import { parseCSVFile } from "../../../../utils/functions/csv";
// import des types
import type { FormEvent, ChangeEvent } from "react";
import type { PointSetType } from "../../../../utils/types/mapTypes";
// import du style
import style from "../introForm/introForm.module.scss";

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

	const { icons, colors } = useContext(IconOptionsContext);

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
			},
		});
	};

	return (
		icons.length && (
			<form onSubmit={handleSubmit} className={style.commonFormContainer}>
				<div className={style.commonFormInputContainer}>
					<LabelComponent
						htmlFor="name"
						label={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointSetName.label
						}
						description={
							translation[language].backoffice.mapFormPage.pointSetForm
								.pointSetName.description
						}
					/>
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
					/>
					<div className={style.inputContainer}>
						<SelectOptionsComponent
							selectId="colorId"
							basicOptionValue="null"
							basicOptionContent={
								translation[language].backoffice.mapFormPage.pointSetForm
									.chooseColor
							}
							options={colors}
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
					/>
					<div className={style.inputContainer}>
						<SelectOptionsComponent
							selectId="iconId"
							basicOptionValue="null"
							basicOptionContent={
								translation[language].backoffice.mapFormPage.pointSetForm
									.chooseIcon
							}
							options={icons}
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
				<button type="submit" className={style.commonFormButton}>
					{translation[language].button.add}
				</button>
			</form>
		)
	);
};

export default PointSetUploadForm;
