// import des bibliothèques
// import des composants
// import du context
// import des services
// import des types
// import du style
import useCustomNoContent from "../../utils/hooks/useCustomNoContent";
import { useTranslation } from "../../utils/hooks/useTranslation";
import style from "./notFoundPage.module.scss";

const NotFoundPage = () => {
	const customNoContentText = useCustomNoContent();
	const { language } = useTranslation();
	return (
		<section className={style.notFoundPage}>
			<div className={style.errorCode}>404</div>
			<div className={style.errorMessage}>Cette page est introuvable !</div>
			<div className={style.customTextContainer}>
				<p>{customNoContentText[`content_${language}`]}</p>
			</div>
		</section>
	);
};

export default NotFoundPage;
