// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des types
import type { MapColorType, MapIconType } from "../../../utils/types/mapTypes";

interface SelectOptionsComponentProps {
	selectId: string;
	basicOptionValue: string;
	basicOptionContent: string;
	options: MapColorType[] | MapIconType[] | number[];
	onChangeFunction: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	value?: string;
}

/**
 * Composant de select/options
 * @param {Object} props : props du composant
 * @param {string} selectId - id du select
 * @param {string} basicOptionValue - valeur de l'option par défaut
 * @param {string} basicOptionContent - contenu de l'option par défaut
 * @param {MapColorType[] | MapIconType[] | number[]} options - liste des options du select
 * @param {function} onChangeFunction - fonction de gestion du changement de valeur
 */
const SelectOptionsComponent = ({
	selectId,
	basicOptionValue,
	basicOptionContent,
	options,
	onChangeFunction,
	value = "",
}: SelectOptionsComponentProps) => {
	// récupération des données de traduction
	const { language } = useTranslation();

	return (
		<>
			<select
				name={selectId}
				id={selectId}
				onChange={onChangeFunction}
				value={value}
			>
				<option value={basicOptionValue}>{basicOptionContent}</option>
				{options.map((option) => {
					if (option instanceof Object) {
						return (
							<option key={option.id} value={option.id}>
								{option[`name_${language}`]}
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
