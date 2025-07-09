// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
import { useMapFilterOptionsStore } from "../../../../utils/stores/builtMap/mapFilterOptionsStore";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";

/**
 * Composant de filtre pour le genre des agents (masculin, féminin, non binaire)
 */
const AgentGenderFilterComponent = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des filtres depuis le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);
	const { initialAgentGenderOptions, filteredAgentGenderOptions } =
		useMapFilterOptionsStore();

	// définition de la fonction qui permet de gérer le changement d'état des checkboxs
	function handleChangeCheckbox(name: string) {
		const newLanguageFiltersObject = {
			...userFilters,
			agentGender: {
				...userFilters.agentGender,
				[name]: !userFilters.agentGender[name] as boolean,
			},
		};
		setUserFilters(newLanguageFiltersObject);
	}

	return (
		<div>
			<div>
				<input
					key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
					type="checkbox"
					id="male"
					name="male"
					defaultChecked={
						initialAgentGenderOptions.includes("male") ||
						filteredAgentGenderOptions.includes("male")
					}
					checked={!userFilters.agentGender?.male}
					onChange={(event) => handleChangeCheckbox(event.target.name)}
					disabled={
						!initialAgentGenderOptions.includes("male") ||
						(filteredAgentGenderOptions.length > 1 &&
							!filteredAgentGenderOptions.includes("male"))
					}
				/>
				<label htmlFor="male">{translation[language].mapPage.aside.male}</label>
			</div>

			<div>
				<input
					key={isReset.toString()}
					type="checkbox"
					id="female"
					name="female"
					defaultChecked={
						initialAgentGenderOptions.includes("female") ||
						filteredAgentGenderOptions.includes("female")
					}
					checked={!userFilters.agentGender?.female}
					onChange={(event) => handleChangeCheckbox(event.target.name)}
					disabled={
						!initialAgentGenderOptions.includes("female") ||
						(filteredAgentGenderOptions.length > 1 &&
							!filteredAgentGenderOptions.includes("female"))
					}
				/>
				<label htmlFor="female">
					{translation[language].mapPage.aside.female}
				</label>
			</div>

			<div>
				<input
					key={isReset.toString()}
					type="checkbox"
					id="nonBinary"
					name="nonBinary"
					defaultChecked={
						initialAgentGenderOptions.includes("nonbinary") ||
						filteredAgentGenderOptions.includes("nonbinary")
					}
					checked={!userFilters.agentGender?.nonBinary}
					onChange={(event) => handleChangeCheckbox(event.target.name)}
					disabled={
						!initialAgentGenderOptions.includes("nonbinary") ||
						(filteredAgentGenderOptions.length > 1 &&
							!filteredAgentGenderOptions.includes("nonbinary"))
					}
				/>
				<label htmlFor="nonBinary">
					{translation[language].mapPage.aside.nonBinary}
				</label>
			</div>
		</div>
	);
};

export default AgentGenderFilterComponent;
