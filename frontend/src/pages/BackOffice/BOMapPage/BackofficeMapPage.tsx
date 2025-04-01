// import des composants
import ManagementContainer from "../../../components/backoffice/managementContainer/ManagementContainer";
import ModalComponent from "../../../components/common/modal/ModalComponent";
import DeleteMapContent from "../../../components/common/modal/DeleteMapContent";
// import des services
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import du style
import style from "./backofficeMapPage.module.scss";

/**
 * Page du backoffice pour la gestion des cartes (création, modification, suppression)
 */
const BackofficeMapPage = () => {
	// récupération des données des stores
	const { isDeleteModalOpen, closeDeleteModal } = useModalStore();
	return (
		<section className={style.backofficeManagementPageContainer}>
			{isDeleteModalOpen && (
				<ModalComponent
					onClose={() => closeDeleteModal()}
					isGreyBackground={true}
				>
					<DeleteMapContent />
				</ModalComponent>
			)}
			<ManagementContainer type="map" key={isDeleteModalOpen.toString()} />
		</section>
	);
};

export default BackofficeMapPage;
