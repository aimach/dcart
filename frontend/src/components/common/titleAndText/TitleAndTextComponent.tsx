// import du style
import style from "./titleAndTextComponent.module.scss";

interface TitleAndTextComponentProps {
	title: string;
	text: string;
}

const TitleAndTextComponent = ({ title, text }: TitleAndTextComponentProps) => {
	return (
		<section className={style.titleAndTextContainer}>
			<h3>{title}</h3>
			<div className={style.verticalSeparator} />
			<p>{text}</p>
		</section>
	);
};

export default TitleAndTextComponent;
