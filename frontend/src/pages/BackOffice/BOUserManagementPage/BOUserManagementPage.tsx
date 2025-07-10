// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import des composants
import LoaderComponent from "../../../components/common/loader/LoaderComponent";
import ModalComponent from "../../../components/common/modal/ModalComponent";
import DeleteUserContent from "../../../components/common/modal/DeleteUserContent";
import UpdateUserStatusContent from "../../../components/common/modal/UpdateUserStatusContent";
import ButtonComponent from "../../../components/common/button/ButtonComponent";
import AddUserForm from "../../../components/form/userForm/AddUserForm";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import du context
import { AuthContext } from "../../../context/AuthContext";
// import des services
import { getAllUsers } from "../../../utils/api/profileAPI";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import des types
import type { User } from "../../../utils/types/userTypes";
import type { userInputType } from "../../../components/form/userForm/AddUserForm";
import { createNewUser, updateUser } from "../../../utils/api/authAPI";
// import des styles
import style from "./userManagementPage.module.scss";
// import des icônes
import { CirclePlus, Pen, Trash } from "lucide-react";

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
		setReload,
	} = useModalStore();

	const [userFormType, setUserFormType] = useState<"create" | "edit">("create");
	const [currentUserInfos, setCurrentUserInfos] = useState<User | null>(null);

	useEffect(() => {
		if (!isAdmin) {
			navigate("/backoffice");
		}
	}, [isAdmin, navigate]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reload pour le rafraîchissement de la liste
	useEffect(() => {
		if (isAdmin) {
			const fetchAllUsers = async () => {
				const allUsers: User[] = await getAllUsers();
				setUsers(allUsers);
				if (allUsers.length > 0) {
					setCurrentUserInfos(
						allUsers.find((user) => user.id === userId) || null,
					);
				}
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

	const [addUserForm, setAddUserForm] = useState(false);

	const handleAddUserSubmit = async (data: userInputType) => {
		await createNewUser(data);
		setAddUserForm(false);
		setCurrentUserInfos(null);
		setUserFormType("create");
		setReload(!reload);
	};

	const handleUpdateUserSubmit = async (data: userInputType) => {
		await updateUser(data, currentUserInfos as User);
		setAddUserForm(false);
		setCurrentUserInfos(null);
		setUserFormType("create");
		setReload(!reload);
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
			<div className={style.userManagementHeader}>
				<ButtonComponent
					type="button"
					color="brown"
					textContent={
						addUserForm
							? translation[language].button.cancel
							: translation[language].backoffice.userManagement.addUser
					}
					onClickFunction={() => {
						setAddUserForm(!addUserForm);
					}}
					icon={addUserForm ? null : <CirclePlus />}
				/>
			</div>
			{addUserForm && (
				<AddUserForm
					onSubmit={
						userFormType === "create"
							? handleAddUserSubmit
							: handleUpdateUserSubmit
					}
					setAddUserForm={setAddUserForm}
					type={userFormType}
					currentUserInfos={currentUserInfos}
				/>
			)}
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
									{
										translation[language].backoffice.userManagement[
											user.status as "admin" | "writer"
										]
									}
								</td>
								<td>
									<div>
										{userId !== user.id ? (
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
										) : (
											<>
												<Pen
													onClick={() => {
														setUserFormType("edit");
														setAddUserForm(true);
														setCurrentUserInfos(user);
														scrollTo({ top: 0, left: 0, behavior: "smooth" });
													}}
												/>
											</>
										)}
									</div>
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
