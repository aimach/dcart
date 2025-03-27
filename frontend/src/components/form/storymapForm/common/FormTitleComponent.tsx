// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import du style
import style from "./formTitleComponent.module.scss";

type FormTitleComponentProps = {
	action: string;
	translationKey: string;
};

/**
 * Retourne le titre du formulaire (h3)
 * @param action - action à réaliser (create ou edit)
 * @param translationKey - clé de traduction
 */
const FormTitleComponent = ({
	action,
	translationKey,
}: FormTitleComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	return (
		<h3 className={style.formTitle}>
			{
				translation[language].backoffice.storymapFormPage.form[
					action === "create" ? "create" : "edit"
				]
			}{" "}
			{
				translation[language].backoffice.storymapFormPage.form[
					translationKey as keyof typeof translation.en.backoffice.storymapFormPage.form
				]
			}
		</h3>
	);
};

export default FormTitleComponent;
