// import du style
import style from "../storymapForm/mapForms/mapForms.module.scss";

type LabelComponentProps = {
	htmlFor: string;
	label: string;
	description: string;
	isRequired?: boolean;
};

const LabelComponent = ({
	htmlFor,
	label,
	description,
	isRequired = true,
}: LabelComponentProps) => {
	return (
		<div className={style.labelContainer}>
			<label htmlFor={htmlFor}>
				{label} {isRequired && <span style={{ color: "#9d2121" }}>*</span>}
			</label>
			<p>{description}</p>
		</div>
	);
};

export default LabelComponent;
