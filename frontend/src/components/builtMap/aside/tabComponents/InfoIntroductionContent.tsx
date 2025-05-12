// import des composants
import ButtonComponent from "../../../common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import du style
import style from "./tabComponent.module.scss";

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

	return (
		<div className={style.introContentContainer}>
			<p>
				Ce panneau vous permet d ’explorer en détail les données associées au
				point que vous avez sélectionné sur la carte. Vous y trouverez des
				statistiques spécifiques, comme un aperçu chiffré des divinités ou
				épithètes présents dans les sources ou consulter les données relatives
				aux agents : genre, activité, etc. Vous pouvez également y trouver la
				liste complète des sources et attestations associées liées à ce point
				avec de nombreux détails : date, versino originale, traduction,
				agents...
			</p>
			<div className={style.checkboxContainer}>
				<input type="checkbox" id="showIntro" onChange={handleCheckbox} />
				<label htmlFor="showIntro">Ne plus afficher ce message</label>
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
