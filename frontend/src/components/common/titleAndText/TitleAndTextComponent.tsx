// import du style
import style from "./titleAndTextComponent.module.scss";
// import des images
import delta from "../../../assets/delta.png";

interface TitleAndTextComponentProps {
	title: string;
	text: string;
}
/**
 * Affichage un titre h3 entouré d'images de décoration et une description
 * @param {string} title le titre h3
 * @param {string} text la description
 * @returns
 */
const TitleAndTextComponent = ({ title, text }: TitleAndTextComponentProps) => {
	return (
		<section className={style.titleAndTextContainer}>
			<div className={style.titleSection}>
				<img
					src={delta}
					alt="decoration"
					width={50}
					height="auto"
					loading="lazy"
				/>
				<h1>{title}</h1>
				<img
					src={delta}
					alt="decoration"
					width={50}
					height="auto"
					loading="lazy"
				/>
			</div>
			<p>{text}</p>
		</section>
	);
};

export default TitleAndTextComponent;
