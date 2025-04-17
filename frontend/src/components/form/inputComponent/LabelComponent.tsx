// import du style
import style from "../storymapForm/mapForms/mapForms.module.scss";

type LabelComponentProps = {
	htmlFor: string;
	label: string;
	description: string;
};

const LabelComponent = ({
	htmlFor,
	label,
	description,
}: LabelComponentProps) => {
	return (
		<div className={style.labelContainer}>
			<label htmlFor={htmlFor}>{label}</label>
			<p>{description}</p>
		</div>
	);
};

export default LabelComponent;
