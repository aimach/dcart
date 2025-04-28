// import des bibliothèques
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
// import du context
import { AuthContext } from "../../../context/AuthContext";

const UserManagementPage = () => {
	const { isAdmin } = useContext(AuthContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (!isAdmin) {
			navigate("/backoffice");
		}
	}, [isAdmin, navigate]);

	return <div>Page de la gestion des utilisateurs</div>;
};

export default UserManagementPage;
