// import des bibliothèques
// import des composants
// import du context
// import des services
// import des types
// import du style
import style from "./tooltipComponent.module.scss";

type TooltipComponentProps = {
	text: string;
	children: React.ReactNode;
};

const TooltipComponent = ({ text, children }: TooltipComponentProps) => {
	return (
		<div className={style.tooltipContainer}>
			{children}
			<span className={style.tooltipText}>{text}</span>
		</div>
	);
};

export default TooltipComponent;
