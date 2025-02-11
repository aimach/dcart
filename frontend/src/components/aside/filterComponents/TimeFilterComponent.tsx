// import des bibliothèques
import { useEffect, useState } from "react";
// import des services
import { getTimeMarkers } from "../../../utils/loaders/loaders";
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { FormEvent } from "react";
import type { TimeMarkersType } from "../../../utils/types/mapTypes";
import type { UserFilterType } from "../../../utils/types/filterTypes";
// import du style
import style from "./filtersComponent.module.scss";

const TimeFilterComponent = () => {
	// on initie le state des marqueurs temporels
	const [timeMarkers, setTimeMarkers] = useState<{
		post: number;
		ante: number;
	}>({ post: 0, ante: 0 });

	// on récupère les filtres de l'utilisateur dans le store
	const { userFilters, setUserFilters } = useMapFiltersStore(
		useShallow((state) => ({
			userFilters: state.userFilters,
			setUserFilters: state.setUserFilters,
		})),
	);

	// on récupère les marqueurs temporels depuis la base de données
	const fetchTimeMarkers = async () => {
		try {
			const newTimeMarkers = await getTimeMarkers();
			setTimeMarkers(newTimeMarkers);
			const newUserFilters = {
				...userFilters,
				post: newTimeMarkers.post,
				ante: newTimeMarkers.ante,
			};
			setUserFilters(newUserFilters);
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

	// on gère le changement des bornes temporelles par l'utilisateur
	const handleTimeFilter = (e: FormEvent<HTMLInputElement>) => {
		let newUserTimeFilters = 0;
		const target = e.target as HTMLInputElement;
		if (target.id === "ante") {
			const minValue = userFilters.post ?? timeMarkers.post;
			newUserTimeFilters = Number.parseInt(target.value, 10);
			if (newUserTimeFilters >= minValue + 100) {
				setUserFilters({
					...userFilters,
					[target.id]: newUserTimeFilters,
				});
			} else {
				target.value = (minValue + 100).toString();
			}
		} else if (target.id === "post") {
			const maxValue = userFilters.ante ?? timeMarkers.ante;
			newUserTimeFilters = Number.parseInt(target.value, 10);
			if (newUserTimeFilters <= maxValue - 100) {
				setUserFilters({
					...userFilters,
					[target.id]: newUserTimeFilters,
				});
			} else {
				target.value = (maxValue - 100).toString();
			}
		}
	};

	// on initie une liste des inputs pour maper dessus
	const inputList = ["post", "ante"];

	return (
		timeMarkers.ante && (
			<div className={style.rangeContainer}>
				<fieldset className={style.slidersControl}>
					{inputList.map((input) => (
						<input
							key={input}
							id={input}
							type="range"
							defaultValue={
								userFilters[input as keyof UserFilterType] === undefined
									? (timeMarkers[input as keyof TimeMarkersType] as number)
									: (userFilters[input as keyof UserFilterType] as number)
							}
							min={timeMarkers.post}
							max={timeMarkers.ante}
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
								userFilters[input as keyof UserFilterType] === undefined
									? (timeMarkers[input as keyof TimeMarkersType] as number)
									: (userFilters[input as keyof UserFilterType] as number)
							}
							readOnly
							min={timeMarkers.post}
							max={timeMarkers.ante}
						/>
					))}
				</div>
			</div>
		)
	);
};

export default TimeFilterComponent;
