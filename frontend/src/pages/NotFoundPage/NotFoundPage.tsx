// import des bibliothèque
// import des custom hooks
import useCustomNoContent from "../../utils/hooks/useCustomNoContent";
// import des services
// import du style
import style from "./notFoundPage.module.scss";

const NotFoundPage = () => {
	const customNoContentText = useCustomNoContent();
	return (
		<section className={style.notFoundPage}>
			<div className={style.errorCode}>404</div>
			<div className={style.errorMessage}>Cette page est introuvable !</div>
			<div className={style.customTextContainer}>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: DOM purifié dans le hook */}
				<p dangerouslySetInnerHTML={{ __html: customNoContentText }} />
			</div>
		</section>
	);
};

export default NotFoundPage;
