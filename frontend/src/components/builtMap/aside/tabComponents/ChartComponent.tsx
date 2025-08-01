// import des bibiliothèques
import { useEffect, useState } from "react";
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
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import {
	getAgentGenderLabelsAndNb,
	getEpithetLabelsAndNb,
	getAgentActivityLabelsAndNb,
} from "../../../../utils/functions/chart";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import {
	getAllColors,
	getDivinityIdsList,
} from "../../../../utils/api/builtMap/getRequests";
// import des types
import type { MapColorType, PointType } from "../../../../utils/types/mapTypes";
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

/**
 * Affiche un graphique (donut ou barre) et des boutons radios (épithète, genre, activité)
 */
const ChartComponent = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { mapInfos, selectedMarker, hasGrayScale } = useMapStore(
		(state) => state,
	);

	// déclaration d'un état pour le type de données à afficher
	const [dataType, setDataType] = useState<string>("epithet");

	// déclaration d'un état pour le type de graphique à afficher
	const [chartType, setChartType] = useState<string>("doughnut");

	// déclaration d'états pour les labels et les données
	const [labels, setLabels] = useState<string[]>([]);
	const [dataSets, setDataSets] = useState<number[]>([]);

	const [allDivinityIds, setAllDivinityIds] = useState<string>("");
	useEffect(() => {
		const fetchDivinityIdsList = async () => {
			const divinityList = await getDivinityIdsList();
			setAllDivinityIds(divinityList);
		};
		fetchDivinityIdsList();
	}, []);

	// mise à jour des labels et données en fonction du type de données, du marqueur sélectionné et de la langue
	useEffect(() => {
		if (!selectedMarker?.sources[0].attestations) return;
		let labels = [];
		let dataSets = [];
		switch (dataType) {
			case "epithet":
				({ labels, dataSets } = getEpithetLabelsAndNb(
					selectedMarker as PointType,
					translation,
					language,
					allDivinityIds,
					mapInfos?.divinity_in_chart ?? false,
				));
				break;
			case "gender":
				({ labels, dataSets } = getAgentGenderLabelsAndNb(
					selectedMarker as PointType,
					language,
					translation,
				));
				break;
			case "activity":
				({ labels, dataSets } = getAgentActivityLabelsAndNb(
					selectedMarker as PointType,
					language,
					translation,
				));
				break;
			default:
				return;
		}

		setLabels(labels);
		setDataSets(dataSets);
	}, [
		dataType,
		selectedMarker,
		language,
		translation,
		allDivinityIds,
		mapInfos?.divinity_in_chart,
	]);

	const [colors, setColors] = useState<string[]>([]);
	useEffect(() => {
		const fetchAllColors = async () => {
			const fetchedColors = await getAllColors();
			const codeHexaArray = fetchedColors.map(
				(color: MapColorType) => color.code_hex,
			);
			setColors(codeHexaArray);
		};
		fetchAllColors();
	}, []);
	const accessibleColors = [
		"#377eb8", // blue
		"#4daf4a", // green
		"#984ea3", // purple
		"#ff7f00", // orange
		"#e41a1c", // red
		"#ffff33", // yellow
		"#a65628", // brown
		"#f781bf", // pink
		"#999999", // gray
	];

	// options pour le graphique en barres
	const barOptions = {
		indexAxis: "x" as const,
		responsive: true,
		animation: {
			animateScale: true, // animation de l'échelle
			duration: 500, // durée en ms
		},
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: false,
			},
			tooltip: {
				xAlign: "center" as const,
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

	// options pour le graphique en donut
	const doughnutOptions = {
		responsive: true,
		animation: {
			animateRotate: true,
			easing: "easeInOutSine",
			duration: 500,
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

	// données finales pour le graphique
	const finalData = {
		labels,
		datasets: [
			{
				data: dataSets,
				backgroundColor: hasGrayScale ? accessibleColors : colors,
			},
		],
	};

	return (
		labels.length &&
		dataSets.length &&
		colors.length && (
			<section className={style.chartContainer}>
				<fieldset className={style.chartType}>
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
						<Doughnut
							data={finalData}
							options={doughnutOptions}
							key={dataType}
						/>
					) : (
						<Bar data={finalData} options={barOptions} key={dataType} />
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
							{
								translation[language].button[
									mapInfos?.divinity_in_chart ? "divinity" : "epithet"
								]
							}
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
