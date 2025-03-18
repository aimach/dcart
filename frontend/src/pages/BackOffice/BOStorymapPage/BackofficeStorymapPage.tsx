// import des composants
import ManagementContainer from "../../../components/backoffice/managementContainer/ManagementContainer";
import DeleteStorymapContent from "../../../components/common/modal/DeleteStorymapContent";
import ModalComponent from "../../../components/common/modal/ModalComponent";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import du style
import style from "./backofficeStorymapPage.module.scss";

/**
 * Page d'accueil de la gestion des storymaps : création, modification, suppression, visualisation
 */
const BackofficeStorymapPage = () => {
	// récupération des données des stores
	const { isDeleteModalOpen, closeDeleteModal } = useModalStore();

	return (
		<>
			{isDeleteModalOpen && (
				<ModalComponent onClose={() => closeDeleteModal()} isDemo={false}>
					<DeleteStorymapContent />
				</ModalComponent>
			)}
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
