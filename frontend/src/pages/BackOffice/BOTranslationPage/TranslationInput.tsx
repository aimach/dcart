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

type TranslationInputProps = {
	id: string;
	translationKey: string;
	value: string | number;
};

const TranslationInput = ({
	id,
	translationKey,
	value,
}: TranslationInputProps) => {
	const { translation, language } = useTranslation();
	const handleChange = async (id: string, key: string) => {
		const responseStatus = await updateTranslationFromKey(id, key, inputValue);
		if (responseStatus === 200) {
			notifyEditSuccess("Traduction", true);
		} else {
			notifyError("Erreur lors de la mise à jour de la traduction");
		}
	};

	const [inputValue, setInputValue] = useState<string>(value as string);

	return (
		<div key={id} className={style.translationInputContainer}>
			<h4>
				{translation[language].backoffice.translationManagement[translationKey]}
			</h4>
			<div className={style.inputAndButton}>
				<textarea
					defaultValue={inputValue}
					onChange={(event) => setInputValue(event.target.value)}
				/>
				<ButtonComponent
					type="button"
					color="brown"
					onClickFunction={() => handleChange(id, translationKey)}
					textContent="Modifier"
				/>
			</div>
		</div>
	);
};

export default TranslationInput;
