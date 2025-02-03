// import des types
import type { PointType } from "../../../types/mapTypes";
// import du style
import style from "./tabComponent.module.scss";

interface ChartComponentProps {
	point: PointType;
}

const ChartComponent = ({ point }: ChartComponentProps) => {
	return <section className={style.chartContainer}>Chart container</section>;
};

export default ChartComponent;
