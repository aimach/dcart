// import des bibliothèques
import { useEffect, useState } from "react";
// import des composants
// import du context
// import des services
import { getTimeMarkers } from "../../../utils/loaders/loaders";
// import des types
import type { FormEvent } from "react";
import type { TimeMarkersType } from "../../../utils/types/mapTypes";
// import du style
import style from "./filtersComponent.module.scss";

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
	const handleTimeFilter = (e: FormEvent<HTMLInputElement>) => {
		let newUserTimeFilters = 0;
		const target = e.target as HTMLInputElement;
		if (target.id === "ante_quem") {
			const minValue = userTimeFilters.post_quem ?? timeMarkers.post_quem;
			newUserTimeFilters = Number.parseInt(target.value, 10);
			if (newUserTimeFilters >= minValue + 100) {
				setUserTimeFilters({
					...userTimeFilters,
					[target.id]: newUserTimeFilters,
				});
			} else {
				target.value = (minValue + 100).toString();
			}
		} else if (target.id === "post_quem") {
			const maxValue = userTimeFilters.ante_quem ?? timeMarkers.ante_quem;
			newUserTimeFilters = Number.parseInt(target.value, 10);
			if (newUserTimeFilters <= maxValue - 100) {
				setUserTimeFilters({
					...userTimeFilters,
					[target.id]: newUserTimeFilters,
				});
			} else {
				target.value = (maxValue - 100).toString();
			}
		}
	};

	const inputList = ["post_quem", "ante_quem"];

	return (
		timeMarkers.ante_quem && (
			<div className={style.rangeContainer}>
				<fieldset className={style.slidersControl}>
					{inputList.map((input) => (
						<input
							key={input}
							id={input}
							type="range"
							defaultValue={
								userTimeFilters[input as keyof TimeMarkersType] === null
									? (timeMarkers[input as keyof TimeMarkersType] as number)
									: (userTimeFilters[input as keyof TimeMarkersType] as number)
							}
							min={timeMarkers.post_quem}
							max={timeMarkers.ante_quem}
							step={100}
							onInput={(e) => handleTimeFilter(e)}
						/>
					))}
				</fieldset>
				<div className={style.formControl}>
					{inputList.map((input) => (
						<input
							key={input}
							type="number"
							id={input}
							value={
								userTimeFilters[input as keyof TimeMarkersType] === null
									? (timeMarkers[input as keyof TimeMarkersType] as number)
									: (userTimeFilters[input as keyof TimeMarkersType] as number)
							}
							readOnly
							min={timeMarkers.post_quem}
							max={timeMarkers.ante_quem}
						/>
					))}
				</div>
			</div>
		)
	);
};

export default TimeFilterComponent;
