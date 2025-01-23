// import des bibliothèques
import { useEffect, useState } from "react";
// import des composants
import SelectOptionsComponent from "../../common/input/SelectOptionsComponent";
// import des services
import {
	getAllGreatRegions,
	getAllDivinities,
	getTimeMarkers,
	getAllPointsByMapId,
} from "../../../utils/loaders/loaders";
// import des types
import type {
	DivinityType,
	GreatRegionType,
	TimeMarkersType,
	PointType,
} from "../../../types/mapTypes";
import type { Dispatch, SetStateAction } from "react";

interface SearchFormComponentProps {
	setAllPoints: Dispatch<SetStateAction<PointType[]>>;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const SearchFormComponent = ({
	setAllPoints,
	setIsModalOpen,
}: SearchFormComponentProps) => {
	const [dataLoaded, setDataLoaded] = useState<boolean>(false);
	const [greatRegions, setGreatRegions] = useState<GreatRegionType[]>([]);
	const [divinities, setDivinities] = useState<DivinityType[]>([]);
	const [timeOptions, setTimeOptions] = useState<number[]>([]);

	useEffect(() => {
		fetchAllDatasForSearchForm();
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// Prevent the browser from reloading the page
		e.preventDefault();

		// Read the form data
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const allPoints = await getAllPointsByMapId("exploration", formData);
		setAllPoints(allPoints);
		setIsModalOpen(false);
	};

	const fetchAllDatasForSearchForm = async () => {
		try {
			const allGreatRegions = await getAllGreatRegions();
			setGreatRegions(allGreatRegions);
			const allDivinities = await getAllDivinities();
			setDivinities(allDivinities);
			const timeMarkers = await getTimeMarkers();
			const timeOptions = createTimeOptions(timeMarkers);
			setTimeOptions(timeOptions);

			setDataLoaded(true);
		} catch (error) {}
	};

	const createTimeOptions = (timeMarkers: TimeMarkersType) => {
		const options = [];
		for (let i = timeMarkers.post_quem; i <= timeMarkers.ante_quem; i += 100) {
			options.push(i);
		}
		return options;
	};

	return (
		dataLoaded && (
			<>
				<form method="post" onSubmit={handleSubmit}>
					<p>
						J'aimerais voir les sources de la région de{" "}
						<SelectOptionsComponent
							selectId="location"
							basicOptionContent="Choisissez une région"
							options={greatRegions}
						/>{" "}
						sur la divinité{" "}
						<SelectOptionsComponent
							selectId="element"
							basicOptionContent="Choisissez une divinité"
							options={divinities}
						/>{" "}
						entre{" "}
						<SelectOptionsComponent
							selectId="post"
							basicOptionContent="date début"
							options={timeOptions}
						/>{" "}
						et{" "}
						<SelectOptionsComponent
							selectId="ante"
							basicOptionContent="date fin"
							options={timeOptions}
						/>{" "}
					</p>
					<button type="submit">Voir les sources</button>
				</form>
				<div>-- OU --</div>
				<button
					type="button"
					onClick={() => setIsModalOpen(false)}
					onKeyUp={() => setIsModalOpen(false)}
				>
					Tout voir
				</button>
			</>
		)
	);
};

export default SearchFormComponent;
