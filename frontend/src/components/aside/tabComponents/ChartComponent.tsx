// import des bibiliothèques
import { useContext, useState } from "react";
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
import { MapContext } from "../../../context/MapContext";
// import des services
import {
	getAgentGenderLabelsAndNb,
	getEpithetLabelsAndNb,
	getAgentActivityLabelsAndNb,
} from "../../../utils/functions/functions";
// import des types
import type { PointType } from "../../../utils/types/mapTypes";
// import du style
import style from "./tabComponent.module.scss";

// import des éléments de chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Colors, Title);

interface ChartComponentProps {
	point: PointType;
}

const ChartComponent = ({ point }: ChartComponentProps) => {
	// on récupère les données de language
	const { translation, language } = useContext(TranslationContext);

	// on récupère l'includedElement en cours
	const { includedElementId } = useContext(MapContext);

	// on initie le state pour le type de chart
	const [dataType, setDataType] = useState<string>("epithet");

	const options = {
		animation: {
			duration: 0,
		},
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: true,
				text: `${point.nom_ville} (${point[`sous_region_${language}`]})`,
			},
		},
	};

	let labels: string[] = [];
	let dataSets: number[] = [];

	switch (dataType) {
		case "epithet": {
			labels = getEpithetLabelsAndNb(
				includedElementId as string,
				point,
				language,
			).labels;
			dataSets = getEpithetLabelsAndNb(
				includedElementId as string,
				point,
				language,
			).dataSets;
			break;
		}
		case "gender": {
			labels = getAgentGenderLabelsAndNb(point, language).labels;
			dataSets = getAgentGenderLabelsAndNb(point, language).dataSets;
			break;
		}
		case "activity": {
			labels = getAgentActivityLabelsAndNb(point, language).labels;
			dataSets = getAgentActivityLabelsAndNb(point, language).dataSets;
			break;
		}

		default:
			break;
	}

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
			<div>
				<Doughnut data={finalData} options={options} />
			</div>
			<fieldset className={style.chartRadio}>
				<div>
					<input
						type="radio"
						id="epithet"
						name="chart"
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
						name="chart"
						value="gender"
						checked={dataType === "gender"}
						onChange={() => setDataType("gender")}
					/>
					<label htmlFor="gender">{translation[language].button.gender}</label>
				</div>

				<div>
					<input
						type="radio"
						id="activity"
						name="chart"
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
	);
};

export default ChartComponent;
