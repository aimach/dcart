// import des bibliothèques
import { useEffect, useState } from "react";
// import des composants
// import du context
// import des services
import { getTimeMarkers } from "../../../utils/loaders/loaders";
// import des types
import type { ChangeEvent } from "react";
// import du style
import style from "./timeFilterComponent.module.scss";

const TimeFilterComponent = () => {
	const [timeMarkers, setTimeMarkers] = useState<{
		post_quem: number;
		ante_quem: number;
	}>({ post_quem: 0, ante_quem: 0 });
	const [userTimeFilters, setUserTimeFilters] = useState<{
		post_quem: number | null;
		ante_quem: number | null;
	}>({
		post_quem: null,
		ante_quem: null,
	});

	const fetchTimeMarkers = async () => {
		try {
			const newTimeMarkers = await getTimeMarkers();
			setTimeMarkers(newTimeMarkers);
			const userFilters = {
				post_quem: newTimeMarkers.post_quem,
				ante_quem: newTimeMarkers.ante_quem,
			};
			setUserTimeFilters(userFilters);
		} catch (error) {
			console.error(
				"Erreur lors du chargement des marqueurs temporels:",
				error,
			);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchTimeMarkers();
	}, []);

	// on gère le changement des bornes temporelles

	const handleTimeFilter = (e: ChangeEvent<HTMLInputElement>) => {
		const newUserTimeFilters = {
			...userTimeFilters,
			[e.target.id]: e.target.value,
		};
		setUserTimeFilters(newUserTimeFilters);
	};

	console.log(userTimeFilters);

	return (
		timeMarkers.ante_quem && (
			<div>
				TimeFilterComponent
				<div>
					<input
						id="post_quem"
						type="range"
						defaultValue={
							userTimeFilters.post_quem === null
								? timeMarkers.post_quem
								: userTimeFilters.post_quem
						}
						min={timeMarkers.post_quem}
						max={timeMarkers.ante_quem}
						step={100}
						onChange={(e) => handleTimeFilter(e)}
					/>
					<input
						id="ante_quem"
						type="range"
						defaultValue={
							userTimeFilters.ante_quem === null
								? timeMarkers.ante_quem
								: userTimeFilters.ante_quem
						}
						min={timeMarkers.post_quem}
						max={timeMarkers.ante_quem}
						step={100}
						onChange={(e) => handleTimeFilter(e)}
					/>
				</div>
			</div>
		)
	);
};

export default TimeFilterComponent;
