// import des bibliothèques
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
// import des types
import type { User } from "../../utils/types/userTypes";
// import des services
import { loginUser } from "../../utils/api/authAPI";
import { AuthContext } from "../../context/AuthContext";

/**
 * Composant de formulaire d'authentification
 */
const AuthFormComponent = () => {
	// récupération des données d'authentification
	const { setIsAuthenticated } = useContext(AuthContext);

	// définition du state pour les données du formulaire
	const [userAuthInformations, setUserAuthInformations] = useState<User>({
		username: "",
		password: "",
	});

	// fonction de gestion du changement dans l'input
	const handleUserAuthInformationsChange = (id: string, value: string) => {
		const newUser = { ...userAuthInformations, [id]: value };
		setUserAuthInformations(newUser);
	};

	// fonction de gestion du bouton "Se connecter"
	const navigate = useNavigate();
	const handleConnectionButtonClick = async () => {
		const isLogged = await loginUser(userAuthInformations);
		setIsAuthenticated(isLogged as boolean);
		if (isLogged) navigate("/backoffice");
	};

	return (
		<>
			<form>
				<div>
					<label htmlFor="username">Nom d'utilisateur : </label>
					<input
						type="text"
						name="username"
						id="username"
						value={userAuthInformations.username}
						onChange={(event) =>
							handleUserAuthInformationsChange("username", event.target.value)
						}
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Mot de passe : </label>
					<input
						type="password"
						name="password"
						id="password"
						value={userAuthInformations.password}
						onChange={(event) =>
							handleUserAuthInformationsChange("password", event.target.value)
						}
						required
					/>
				</div>
			</form>
			<button type="button" onClick={handleConnectionButtonClick}>
				Se connecter
			</button>
		</>
	);
};

export default AuthFormComponent;
