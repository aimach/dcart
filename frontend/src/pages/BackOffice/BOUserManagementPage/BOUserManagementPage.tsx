// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import des composants
import LoaderComponent from "../../../components/common/loader/LoaderComponent";
import ModalComponent from "../../../components/common/modal/ModalComponent";
import DeleteUserContent from "../../../components/common/modal/DeleteUserContent";
// import du context
import { AuthContext } from "../../../context/AuthContext";
// import des services
import { getAllUsers } from "../../../utils/api/common/getRequests";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import des types
import type { User } from "../../../utils/types/userTypes";
// import des icônes
import { Trash } from "lucide-react";
import UpdateUserStatusContent from "../../../components/common/modal/UpdateUserStatusContent";

const UserManagementPage = () => {
	const { isAdmin } = useContext(AuthContext);

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
		<section>
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
			<h4>Gestion des utilisateurs</h4>
			<table>
				<thead>
					<tr>
						<th>Nom d'utilisateur</th>
						<th>Pseudo</th>
						<th>Rôle</th>
						<th>Liens rapides</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.username}</td>
							<td>{user.pseudo}</td>
							<td>{user.status}</td>
							<td>
								{userId !== user.id && (
									<>
										<button
											type="button"
											onClick={() => handleStatusClick(user.id as string)}
										>
											{user.status === "admin"
												? "Passer en auteur"
												: "Passer en admin"}
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
		</section>
	) : (
		<LoaderComponent size={40} />
	);
};

export default UserManagementPage;
