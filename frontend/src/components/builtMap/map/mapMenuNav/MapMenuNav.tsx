// import des composants
import NavComponent from "../../../common/NavComponent";
// import des types
import type { NavList } from "../../../../utils/types/commonTypes";
// import du style
import style from "./mapMenuNav.module.scss";

interface MapMenuNavProps {
	mapList: NavList;
}

/**
 * Composant du menu de navigation des cartes
 * @param {Object} props - Les propriétés du composant
 * @param {NavList} props.mapList - La liste des cartes
 * @returns NavComponent
 */
const MapMenuNav = ({ mapList }: MapMenuNavProps) => {
	return (
		<NavComponent
			type="augmented"
			navClassName={style.mapMenuNav}
			list={mapList}
			activeLinkClassName={style.mapMenuNavActive}
		/>
	);
};

export default MapMenuNav;
