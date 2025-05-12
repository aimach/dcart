// import des composants
import ButtonComponent from "../../../common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import du style
import style from "./tabComponent.module.scss";
import { useEffect, useMemo, useState } from "react";
import { getTranslations } from "../../../../utils/api/translationAPI";

type InfoIntroductionContentProps = {
	setIsIntroDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
};

const InfoIntroductionContent = ({
	setIsIntroDisplayed,
}: InfoIntroductionContentProps) => {
	const { translation, language } = useTranslation();

	const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			sessionStorage.setItem("showIntro", "false");
		} else {
			sessionStorage.setItem("showIntro", "true");
		}
	};

	const [databaseTranslation, setDatabaseTranslation] = useState<
		Record<string, string>[]
	>([]);

	useEffect(() => {
		const fetchDatabaseTranslation = async () => {
			const translations = await getTranslations();
			setDatabaseTranslation(translations);
		};
		fetchDatabaseTranslation();
	}, []);

	const introContent = useMemo(() => {
		if (databaseTranslation?.length > 0) {
			const translationObject = databaseTranslation.find(
				(translation) => translation.language === language,
			) as { translations: Record<string, string> } | undefined;
			return translationObject?.translations["mapPage.introContent"];
		}
		return translation[language].mapPage.aside.introContent;
	}, [databaseTranslation, translation, language]);

	return (
		<div className={style.introContentContainer}>
			<p>{introContent}</p>
			<div className={style.checkboxContainer}>
				<input type="checkbox" id="showIntro" onChange={handleCheckbox} />
				<label htmlFor="showIntro">
					{translation[language].mapPage.aside.dontShowAgain}
				</label>
			</div>
			<ButtonComponent
				type="button"
				textContent={translation[language].common.next}
				color="brown"
				onClickFunction={() => setIsIntroDisplayed(false)}
			/>
		</div>
	);
};

export default InfoIntroductionContent;
