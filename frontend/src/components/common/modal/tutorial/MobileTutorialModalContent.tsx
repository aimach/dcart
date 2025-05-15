// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des composants
import ButtonComponent from "../../button/ButtonComponent";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useShallow } from "zustand/shallow";
import { mobileTutorialContent } from "../../../../utils/menu/modalArray";
// import du style
import style from "./tutorialModalContent.module.scss";
// import des images et icônes
import delta from "../../../../assets/delta.png";

const MobileTutorialModalContent = () => {
	const { language } = useTranslation();

	return (
		<div className={style.tutorialModalContent}>
			<div className={style.contentContainer}>
				<div className={style.modalTitleSection}>
					<img src={delta} alt="decoration" width={30} />
					<h4>{mobileTutorialContent[`title_${language}`]}</h4>
					<img src={delta} alt="decoration" width={30} />
				</div>
				<p>{mobileTutorialContent[`content_${language}`]}</p>
			</div>
		</div>
	);
};

export default MobileTutorialModalContent;
