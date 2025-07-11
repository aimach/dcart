// import des custom hooks
import { NotFoundPageHelmetContent } from "../../components/helmet/HelmetContent";
import useCustomNoContent from "../../utils/hooks/useCustomNoContent";
import { useTranslation } from "../../utils/hooks/useTranslation";
// import du style
import style from "./notFoundPage.module.scss";

const NotFoundPage = () => {
	const customNoContentText = useCustomNoContent();
	const { language, translation } = useTranslation();
	return (
		<>
			<NotFoundPageHelmetContent />
			<section className={style.notFoundPage}>
				<div className={style.errorCode}>404</div>
				<div className={style.errorMessage}>
					{translation[language].noPageFound}.
				</div>
				<div className={style.customTextContainer}>
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: DOM purifié dans le hook */}
					<p dangerouslySetInnerHTML={{ __html: customNoContentText }} />
				</div>
			</section>
		</>
	);
};

export default NotFoundPage;
