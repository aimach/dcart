// import des composants
import ManagementContainer from "../../../components/backoffice/managementContainer/ManagementContainer";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import du style
import style from "./backofficeStorymapPage.module.scss";

/**
 * Page d'accueil de la gestion des storymaps : création, modification, suppression, visualisation
 */
const BackofficeStorymapPage = () => {
	// récupération des données des stores
	const { isDeleteModalOpen } = useModalStore();

	return (
		<>
			<section className={style.backofficeManagementPageContainer}>
				<ManagementContainer
					type="storymap"
					key={isDeleteModalOpen.toString()}
				/>
			</section>
		</>
	);
};

export default BackofficeStorymapPage;
