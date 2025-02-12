// import des bibliothèques
import { useContext, useEffect, useState } from "react";
// import des composants
import SelectOptionsComponent from "../../common/input/SelectOptionsComponent";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import {
	getAllGreatRegions,
	getAllDivinities,
	getTimeMarkers,
	getAllPointsByMapId,
} from "../../../utils/loaders/loaders";
import { useMapStore } from "../../../utils/stores/mapStore";
// import des types
import type {
	DivinityType,
	GreatRegionType,
	TimeMarkersType,
} from "../../../utils/types/mapTypes";
import type { Dispatch, SetStateAction } from "react";

interface SearchFormComponentProps {
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const SearchFormComponent = ({ setIsModalOpen }: SearchFormComponentProps) => {
	// on récupère le langage
	const { language, translation } = useContext(TranslationContext);

	// on récupère les points
	const { setAllPoints } = useMapStore();

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
		for (let i = timeMarkers.post; i <= timeMarkers.ante; i += 100) {
			options.push(i);
		}
		return options;
	};

	return (
		dataLoaded && (
			<>
				<form method="post" onSubmit={handleSubmit}>
					<p>
						{translation[language].modal.firstContent}{" "}
						<SelectOptionsComponent
							selectId="location"
							basicOptionContent={translation[language].modal.chooseRegion}
							options={greatRegions}
						/>{" "}
						{translation[language].modal.secondContent}{" "}
						<SelectOptionsComponent
							selectId="element"
							basicOptionContent={translation[language].modal.chooseDivinity}
							options={divinities}
						/>{" "}
						{translation[language].common.between}{" "}
						<SelectOptionsComponent
							selectId="post"
							basicOptionContent={translation[language].modal.postDate}
							options={timeOptions}
						/>{" "}
						{translation[language].common.between}{" "}
						<SelectOptionsComponent
							selectId="ante"
							basicOptionContent={translation[language].modal.anteDate}
							options={timeOptions}
						/>{" "}
					</p>
					<button type="submit">
						{translation[language].button.seeSources}
					</button>
				</form>
				<div>-- {translation[language].common.or} --</div>
				<button
					type="button"
					onClick={() => setIsModalOpen(false)}
					onKeyUp={() => setIsModalOpen(false)}
				>
					{translation[language].button.seeAll}
				</button>
			</>
		)
	);
};

export default SearchFormComponent;
