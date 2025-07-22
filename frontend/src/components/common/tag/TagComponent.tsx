// import du style
import style from "./tagComponent.module.scss";

type TagComponentProps = {
	color: "red" | "blue" | "green" | "yellow";
	text: string;
};

const TagComponent = ({ color, text }: TagComponentProps) => {
	const tagColor = style[`color_${color}`];
	return <div className={tagColor}>{text}</div>;
};

export default TagComponent;
