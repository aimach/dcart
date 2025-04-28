// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import des composants
import LoaderComponent from "../../../components/common/loader/LoaderComponent";
// import du context
import { AuthContext } from "../../../context/AuthContext";
// import des services
import { getAllUsers } from "../../../utils/api/common/getRequests";
// import des types
import type { User } from "../../../utils/types/userTypes";

const UserManagementPage = () => {
	const { isAdmin } = useContext(AuthContext);

	const navigate = useNavigate();

	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		if (!isAdmin) {
			navigate("/backoffice");
		}
	}, [isAdmin, navigate]);

	useEffect(() => {
		if (isAdmin) {
			const fetchAllUsers = async () => {
				const allUsers = await getAllUsers();
				setUsers(allUsers);
			};
			fetchAllUsers();
		}
	}, [isAdmin]);

	console.log(users);

	return users.length > 0 ? (
		<div>
			<h4>Gestion des utilisateurs</h4>
			<table>
				<thead>
					<tr>
						<th>Nom d'utilisateur</th>
						<th>Pseudo</th>
						<th>Rôle</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.pseudo}</td>
							<td>{user.username}</td>
							<td>{user.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	) : (
		<LoaderComponent size={40} />
	);
};

export default UserManagementPage;
