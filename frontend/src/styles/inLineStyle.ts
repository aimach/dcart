// import des types
import type { OptionType } from "../utils/types/commonTypes";
import type { CSSObjectWithLabel, ControlProps } from "react-select";

const multiSelectInLineStyle = {
	control: (
		base: CSSObjectWithLabel,
		props: ControlProps<OptionType, true>,
	) => ({
		...base,
		border: props.isFocused ? "none" : "none",
		borderBottom: "1px solid #251F18",
		width: "200px",
	}),
	option: (
		base: CSSObjectWithLabel,
		{ isFocused }: { isFocused: boolean },
	) => ({
		...base,
		backgroundColor: isFocused ? "#DED6CE" : "white",
		color: "#251F18",
		":active": {
			backgroundColor: "#AD9A85",
		},
	}),
};

export { multiSelectInLineStyle };
