// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
// import des types

type TypeAgentGenderFilterComponentProps = {
	agentGenderOptions: string[];
};

/**
 * Composant de filtre pour le genre des agents (masculin, féminin, non binaire)
 */
const AgentGenderFilterComponent = ({
	agentGenderOptions,
}: TypeAgentGenderFilterComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des filtres depuis le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	// définition de la fonction qui permet de gérer le changement d'état des checkboxs
	function handleChangeCheckbox(checked: boolean, name: string) {
		const newLanguageFiltersObject = {
			...userFilters,
			agentGender: { ...userFilters.agentGender, [name]: checked as boolean },
		};
		setUserFilters(newLanguageFiltersObject);
	}

	return (
		<div>
			{agentGenderOptions.includes("male") && (
				<div>
					<input
						key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
						type="checkbox"
						id="male"
						name="male"
						checked={userFilters.agentGender?.male ?? true}
						onChange={(event) =>
							handleChangeCheckbox(event.target.checked, event.target.name)
						}
					/>
					<label htmlFor="male">
						{translation[language].mapPage.aside.male}
					</label>
				</div>
			)}
			{agentGenderOptions.includes("female") && (
				<div>
					<input
						key={isReset.toString()}
						type="checkbox"
						id="female"
						name="female"
						checked={userFilters.agentGender?.female ?? true}
						onChange={(event) =>
							handleChangeCheckbox(event.target.checked, event.target.name)
						}
					/>
					<label htmlFor="female">
						{translation[language].mapPage.aside.female}
					</label>
				</div>
			)}
			{agentGenderOptions.includes("nonbinary") && (
				<div>
					<input
						key={isReset.toString()}
						type="checkbox"
						id="nonBinary"
						name="nonBinary"
						checked={userFilters.agentGender?.nonBinary ?? true}
						onChange={(event) =>
							handleChangeCheckbox(event.target.checked, event.target.name)
						}
					/>
					<label htmlFor="nonBinary">
						{translation[language].mapPage.aside.nonBinary}
					</label>
				</div>
			)}
		</div>
	);
};

export default AgentGenderFilterComponent;
