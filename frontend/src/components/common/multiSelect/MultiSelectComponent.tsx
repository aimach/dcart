// import des bibliothèques
import Select from "react-select";
// import des types
import type { OptionType } from "../../../utils/types/commonTypes";
import type { MultiValue } from "react-select";
// import du style
import { multiSelectInLineStyle } from "../../../styles/inLineStyle";

type MultiSelectComponentProps = {
	options: OptionType[];
	selectKey: string;
	placeholder: string;
	handleChange: (key: string, value: MultiValue<OptionType>) => void;
	isMulti?: boolean;
};

/**
 * Composant qui renvoie un selecteur multiple react-select
 * @param {OptionType[]} options - Les options du selecteur
 * @param {string} selectKey - La clé du selecteur
 * @param {string} placeholder - Le placeholder du selecteur
 * @param {(key: string, value: MultiValue<OptionType>) => void} handleChange - La fonction de changement de valeur
 * @param {boolean} [isMulti=true] - Indique si le selecteur est multiple ou non
 * @returns Select (react-select)
 */
const MultiSelectComponent = ({
	options,
	selectKey,
	placeholder,
	handleChange,
	isMulti = true,
}: MultiSelectComponentProps) => {
	return (
		<Select
			styles={multiSelectInLineStyle}
			options={options}
			delimiter="|"
			isMulti={isMulti ? true : undefined}
			placeholder={placeholder}
			onChange={(newValue) =>
				handleChange(selectKey, newValue as MultiValue<OptionType>)
			}
			blurInputOnSelect
		/>
	);
};

export default MultiSelectComponent;
