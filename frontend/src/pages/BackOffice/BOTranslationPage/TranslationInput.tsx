// import des bibliothèques
import { useState } from "react";
// import des composants
import ButtonComponent from "../../../components/common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { updateTranslationFromKey } from "../../../utils/api/translationAPI";
import { notifyEditSuccess, notifyError } from "../../../utils/functions/toast";
// import du style
import style from "./BOTranslationPage.module.scss";
import { useForm } from "react-hook-form";
import type { TranslationObjectType } from "../../../utils/types/languageTypes";
import LabelComponent from "../../../components/form/inputComponent/LabelComponent";
import ErrorComponent from "../../../components/form/errorComponent/ErrorComponent";

type TranslationInputProps = {
	translationObject: TranslationObjectType;
};

const TranslationInput = ({ translationObject }: TranslationInputProps) => {
	const { translation, language } = useTranslation();
	const handleChange = async (data: TranslationObjectType) => {
		const responseStatus = await updateTranslationFromKey(
			data.id,
			data.key,
			data.fr,
			data.en,
		);
		if (responseStatus === 200) {
			notifyEditSuccess("Traduction", true);
		} else {
			notifyError("Erreur lors de la mise à jour de la traduction");
		}
	};

	// import des sevice de formulaire
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TranslationObjectType>({
		defaultValues: translationObject ?? {},
	});

	return (
		<form onSubmit={handleSubmit(handleChange)}>
			<div className={style.translationManagementForm}>
				<div className={style.translationManagementRow}>
					<p>
						{
							translation[language].backoffice.translationManagement[
								translationObject.key
							]
						}
					</p>
					<div className={style.translationInputContainer}>
						<LabelComponent
							htmlFor="fr"
							label={
								translation[language].backoffice.translationManagement
									.frenchTranslation
							}
							description=""
						/>
						<textarea
							id="fr"
							defaultValue={translationObject.fr}
							{...register("fr", {
								required: "Le champ français est requis",
							})}
						/>
					</div>
					<div className={style.translationInputContainer}>
						<LabelComponent
							htmlFor="en"
							label={
								translation[language].backoffice.translationManagement
									.englishTranslation
							}
							description=""
						/>
						<textarea
							id="en"
							defaultValue={translationObject.en}
							{...register("en", {
								required: "Le champ anglais est requis",
							})}
						/>
					</div>
				</div>
				{Object.keys(errors).length > 0 && (
					<ErrorComponent message={errors[Object.keys(errors)[0]].message} />
				)}
			</div>
			<div className={style.buttonContainer}>
				<ButtonComponent
					type="submit"
					color="brown"
					textContent={translation[language].button.edit}
				/>
			</div>
		</form>
	);
};

export default TranslationInput;
