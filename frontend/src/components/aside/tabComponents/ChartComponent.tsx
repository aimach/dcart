// import des bibiliothèques
import { useContext, useEffect, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Tooltip,
	Legend,
	Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import {
	getAgentGenderLabelsAndNb,
	getEpithetLabelsAndNb,
	getAgentActivityLabelsAndNb,
} from "../../../utils/functions/functions";
import { useMapStore } from "../../../utils/stores/mapStore";
// import des types
import type { PointType } from "../../../utils/types/mapTypes";
// import du style
import style from "./tabComponent.module.scss";
// import des icônes
import { ChartColumnBig, ChartPie } from "lucide-react";

// import des éléments de chart.js
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Tooltip,
	Legend,
	Title,
);

interface ChartComponentProps {
	point: PointType;
}

const ChartComponent = ({ point }: ChartComponentProps) => {
	// on récupère les données de language
	const { translation, language } = useContext(TranslationContext);

	// on récupère l'includedElement en cours
	const includedElementId = useMapStore((state) => state.includedElementId);

	// on initie le state pour le type de données à afficher
	const [dataType, setDataType] = useState<string>("epithet");

	// on initie le state pour le type de chart
	const [chartType, setChartType] = useState<string>("doughnut");

	// on initie les labels et les datasets
	const [labels, setLabels] = useState<string[]>([]);
	const [dataSets, setDataSets] = useState<number[]>([]);

	useEffect(() => {
		let labels = [];
		let dataSets = [];

		switch (dataType) {
			case "epithet":
				({ labels, dataSets } = getEpithetLabelsAndNb(
					includedElementId as string,
					point,
					language,
				));
				break;
			case "gender":
				({ labels, dataSets } = getAgentGenderLabelsAndNb(point, language));
				break;
			case "activity":
				({ labels, dataSets } = getAgentActivityLabelsAndNb(point, language));
				break;
			default:
				return;
		}

		setLabels(labels);
		setDataSets(dataSets);
	}, [dataType, point, language, includedElementId]);

	const barOptions = {
		indexAxis: "x" as const,
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: false,
			},
			tooltip: {
				xAlign: "center",
			},
		},
		scales: {
			x: {
				display: false,
			},
			y: {
				display: true,
			},
		},
	};

	const doughnutOptions = {
		responsive: true,
		animation: {
			duration: 0,
		},
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: false,
			},
		},
	};

	const commonColor = "#AD9A85";

	const finalData = {
		labels,
		datasets: [
			{
				data: dataSets,
				backgroundColor: commonColor,
			},
		],
	};

	return (
		labels.length &&
		dataSets.length && (
			<section className={style.chartContainer}>
				<fieldset className={style.chartRadio}>
					<ChartPie
						size={24}
						style={{ color: chartType === "doughnut" ? "#251F18" : "#a1afc4" }}
						onClick={() => setChartType("doughnut")}
					/>
					<ChartColumnBig
						size={24}
						style={{ color: chartType === "bar" ? "#251F18" : "#a1afc4" }}
						onClick={() => setChartType("bar")}
					/>
				</fieldset>
				<div>
					{chartType === "doughnut" ? (
						<Doughnut data={finalData} options={doughnutOptions} />
					) : (
						<Bar data={finalData} options={barOptions} />
					)}
				</div>
				<fieldset className={style.chartRadio}>
					<div>
						<input
							type="radio"
							id="epithet"
							name="dataType"
							value="epithet"
							checked={dataType === "epithet"}
							onChange={() => setDataType("epithet")}
						/>
						<label htmlFor="epithet">
							{translation[language].button.epithet}
						</label>
					</div>

					<div>
						<input
							type="radio"
							id="gender"
							name="dataType"
							value="gender"
							checked={dataType === "gender"}
							onChange={() => setDataType("gender")}
						/>
						<label htmlFor="gender">
							{translation[language].button.gender}
						</label>
					</div>

					<div>
						<input
							type="radio"
							id="activity"
							name="dataType"
							value="activity"
							checked={dataType === "activity"}
							onChange={() => setDataType("activity")}
						/>
						<label htmlFor="activity">
							{translation[language].button.activity}
						</label>
					</div>
				</fieldset>
			</section>
		)
	);
};

export default ChartComponent;
