// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import des composants
import LoaderComponent from "../../../components/common/loader/LoaderComponent";
import ModalComponent from "../../../components/common/modal/ModalComponent";
import DeleteUserContent from "../../../components/common/modal/DeleteUserContent";
import UpdateUserStatusContent from "../../../components/common/modal/UpdateUserStatusContent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import du context
import { AuthContext } from "../../../context/AuthContext";
// import des services
import { getAllUsers } from "../../../utils/api/profileAPI";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import des types
import type { User } from "../../../utils/types/userTypes";
// import des styles
import style from "./userManagementPage.module.scss";
// import des icônes
import { Trash } from "lucide-react";

const UserManagementPage = () => {
	const { isAdmin } = useContext(AuthContext);

	const { translation, language } = useTranslation();

	const navigate = useNavigate();

	const { userId } = useContext(AuthContext);

	const [users, setUsers] = useState<User[]>([]);
	const {
		openDeleteModal,
		setIdToDelete,
		closeDeleteModal,
		isDeleteModalOpen,
		openUpdateModal,
		setIdToUpdate,
		closeUpdateModal,
		isUpdateModalOpen,
		reload,
	} = useModalStore();

	useEffect(() => {
		if (!isAdmin) {
			navigate("/backoffice");
		}
	}, [isAdmin, navigate]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reload pour le rafraîchissement de la liste
	useEffect(() => {
		if (isAdmin) {
			const fetchAllUsers = async () => {
				const allUsers = await getAllUsers();
				setUsers(allUsers);
			};
			fetchAllUsers();
		}
	}, [isAdmin, reload]);

	const handleDeleteClick = (userId: string) => {
		openDeleteModal();
		setIdToDelete(userId);
	};

	const handleStatusClick = (userId: string) => {
		openUpdateModal();
		setIdToUpdate(userId);
	};

	return users.length > 0 ? (
		<section className={style.userManagementSection}>
			{isDeleteModalOpen && (
				<ModalComponent onClose={() => closeDeleteModal()}>
					<DeleteUserContent />
				</ModalComponent>
			)}
			{isUpdateModalOpen && (
				<ModalComponent onClose={() => closeUpdateModal()}>
					<UpdateUserStatusContent />
				</ModalComponent>
			)}
			<h4>{translation[language].backoffice.userManagement.title}</h4>
			<div className={style.userManagementTableContainer}>
				<table className={style.managementTable}>
					<thead>
						<tr>
							<th>
								{translation[language].backoffice.userManagement.username}
							</th>
							<th>{translation[language].backoffice.userManagement.pseudo}</th>
							<th>{translation[language].backoffice.userManagement.status}</th>
							<th>{translation[language].backoffice.userManagement.links}</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id} className={style.userTableRow}>
								<td>{user.username}</td>
								<td>{user.pseudo}</td>
								<td>
									{translation[language].backoffice.userManagement[user.status]}
								</td>
								<td>
									{userId !== user.id && (
										<>
											<button
												type="button"
												onClick={() => handleStatusClick(user.id as string)}
											>
												{user.status === "admin"
													? translation[language].backoffice.userManagement
															.toAuthor
													: translation[language].backoffice.userManagement
															.toAdmin}
											</button>
											<Trash
												color="#9d2121"
												onClick={() => handleDeleteClick(user.id as string)}
											/>
										</>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	) : (
		<LoaderComponent size={40} />
	);
};

export default UserManagementPage;
