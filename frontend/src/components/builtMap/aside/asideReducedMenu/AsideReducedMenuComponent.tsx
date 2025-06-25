// import des composants
import NavComponent from "../../../common/NavComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { uploadMapImage } from "../../../../utils/functions/map";
// import des types
import type { NavList } from "../../../../utils/types/commonTypes";
import type {
	MapInfoType,
	MenuTabType,
} from "../../../../utils/types/mapTypes";
// import du style
import style from "./asideReducedMenuComponent.module.scss";
// import des icones
import {
	CircleHelp,
	Filter,
	ImageDown,
	ListCollapse,
	Loader,
	MapPin,
} from "lucide-react";

/**
 * Affiche le panel latéral en version réduite, avec le lien vers les onglets
 * @param {Object} props
 * @returns NavComponent
 */
const AsideReducedMenuComponent = () => {
	// récupération des données des stores
	const { setSelectedTabMenu, setIsPanelDisplayed } = useMapAsideMenuStore();
	const {
		map,
		mapInfos,
		mapReady,
		openTutorial,
		tutorialStep,
		resetTutorialStep,
		mapIsDownloading,
		setMapIsDownloading,
	} = useMapStore();

	const { language } = useTranslation();

	const openMenuOnSelectedTab = (tab: MenuTabType) => {
		setSelectedTabMenu(tab);
		setIsPanelDisplayed(true);
	};

	const reducedAsideNavList: NavList = [
		{
			id: "results",
			title: <ListCollapse />,
			onClickFunction: () => openMenuOnSelectedTab("results"),
			route: undefined,
		},
		{
			id: "filters",
			title: <Filter />,
			onClickFunction: () => openMenuOnSelectedTab("filters"),
			route: undefined,
		},
		{
			id: "infos",
			title: <MapPin />,
			onClickFunction: () => openMenuOnSelectedTab("infos"),
			route: undefined,
		},
		{
			id: "tuto",
			title: <CircleHelp />,
			onClickFunction: () => {
				resetTutorialStep();
				openTutorial();
			},
			route: undefined,
		},
		{
			id: "screenshot",
			title: mapIsDownloading ? (
				<Loader className={style.spin} />
			) : (
				<ImageDown />
			),
			onClickFunction: () => {
				uploadMapImage(
					mapReady,
					mapInfos as MapInfoType,
					language,
					setMapIsDownloading,
				);
			},
			route: undefined,
		},
	];
	return (
		<NavComponent
			type="list"
			navClassName={
				tutorialStep === 5
					? `${style.reducedAsideNav} ${style.reducedAsideNavWhite}`
					: style.reducedAsideNav
			}
			list={reducedAsideNavList}
		/>
	);
};

export default AsideReducedMenuComponent;
