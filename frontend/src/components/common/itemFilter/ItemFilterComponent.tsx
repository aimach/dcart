// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import du style
import style from "./itemFilterComponent.module.scss";

type ItemFilterComponentProps = {
	itemTypes: { map: boolean; storymap: boolean };
	handleCheckboxChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "map" | "storymap",
	) => void;
};

const ItemFilterComponent = ({
	itemTypes,
	handleCheckboxChange,
}: ItemFilterComponentProps) => {
	const { translation, language } = useTranslation();
	return (
		<div className={style.filterContainer}>
			<div className={style.filterInputContainer}>
				<input
					type="checkbox"
					name="map"
					id="map"
					checked={itemTypes.map}
					onChange={(e) => handleCheckboxChange(e, "map")}
				/>
				<label htmlFor="map">{translation[language].common.map}s</label>
			</div>
			<div className={style.filterInputContainer}>
				<input
					type="checkbox"
					name="storymap"
					id="storymap"
					checked={itemTypes.storymap}
					onChange={(e) => handleCheckboxChange(e, "storymap")}
				/>
				<label htmlFor="storymap">
					{translation[language].common.storymap}s
				</label>
			</div>
		</div>
	);
};

export default ItemFilterComponent;
