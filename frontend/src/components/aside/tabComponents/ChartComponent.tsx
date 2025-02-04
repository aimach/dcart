// import des bibiliothèques
import { useContext } from "react";
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	Colors,
	Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des types
import type { PointType } from "../../../utils/types/mapTypes";
// import du style
import style from "./tabComponent.module.scss";
import {
	getAgentGenderLabelsAndNb,
	getEpithetLabelsAndNb,
	getAgentActivityLabelsAndNb,
} from "../../../utils/functions/functions";
import { MapContext } from "../../../context/MapContext";

// import des éléments de chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Colors, Title);

interface ChartComponentProps {
	point: PointType;
}

const ChartComponent = ({ point }: ChartComponentProps) => {
	// on récupère les données de language
	const { language } = useContext(TranslationContext);

	// on récupère l'includedElement en cours
	const { includedElementId } = useContext(MapContext);

	const options = {
		animation: {
			duration: 0,
		},
		plugins: {
			responsive: true,
			legend: {
				display: false,
			},
			title: {
				display: true,
				// text: parseInt(point.sum, 10),
				text: `${point.nom_ville} (${point[`sous_region_${language}`]})`,
			},
		},
	};

	// const { labels, dataSets } = getEpithetLabelsAndNb(
	// 	includedElementId as string,
	// 	point,
	// 	language,
	// );

	// const { labels, dataSets } = getAgentGenderLabelsAndNb(point, language);

	const { labels, dataSets } = getAgentActivityLabelsAndNb(point, language);

	const finalData = {
		labels,
		datasets: [
			{
				data: dataSets,
			},
		],
	};

	return (
		<section className={style.chartContainer}>
			{" "}
			<Doughnut data={finalData} options={options} />
		</section>
	);
};

export default ChartComponent;
