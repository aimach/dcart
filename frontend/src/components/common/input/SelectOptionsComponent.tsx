// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des types
import type {
	DivinityType,
	GreatRegionType,
} from "../../../utils/types/mapTypes";

interface SelectOptionsComponentProps {
	selectId: string;
	basicOptionContent: string;
	options: GreatRegionType[] | DivinityType[] | number[];
}

/**
 * Composant de select/options
 * @param {Object} props : props du composant
 * @param {string} selectId - id du select
 * @param {string} basicOptionContent - contenu de l'option par défaut
 * @param {GreatRegionType[] | DivinityType[] | number[]} options - liste des options du select
 */
const SelectOptionsComponent = ({
	selectId,
	basicOptionContent,
	options,
}: SelectOptionsComponentProps) => {
	// récupération des données de traduction
	const { language } = useTranslation();

	return (
		<>
			<select name={selectId} id={selectId}>
				<option value="">{basicOptionContent}</option>
				{options.map((option) => {
					if (option instanceof Object) {
						return (
							<option key={option.id} value={option.id}>
								{option[`nom_${language}`]}
							</option>
						);
					}
					return (
						<option key={option as number} value={option as number}>
							{option as number}
						</option>
					);
				})}
			</select>
		</>
	);
};

export default SelectOptionsComponent;
