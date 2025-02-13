// import du style
import style from "./titleAndTextComponent.module.scss";
// import des images
import delta from "../../../assets/delta.png";

interface TitleAndTextComponentProps {
	title: string;
	text: string;
}

const TitleAndTextComponent = ({ title, text }: TitleAndTextComponentProps) => {
	return (
		<section className={style.titleAndTextContainer}>
			<div className={style.titleSection}>
				<img src={delta} alt="decoration" width={50} />
				<h3>{title}</h3>
				<img src={delta} alt="decoration" width={50} />
			</div>
			<p>{text}</p>
		</section>
	);
};

export default TitleAndTextComponent;
