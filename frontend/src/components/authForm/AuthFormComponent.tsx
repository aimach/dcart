// import des bibliothèques
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
// import des composants
import ButtonComponent from "../common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import du contexte
import { AuthContext } from "../../context/AuthContext";
// import des types
import type { User } from "../../utils/types/userTypes";
// import des services
import { loginUser } from "../../utils/api/authAPI";
// import du style
import style from "./authFormComponent.module.scss";

/**
 * Composant de formulaire d'authentification
 */
const AuthFormComponent = () => {
	const { language, translation } = useTranslation();

	const { setToken } = useContext(AuthContext);

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
		const loginUserResponse = await loginUser(userAuthInformations);
		setToken(loginUserResponse.accessToken as string);
		if (loginUserResponse.accessToken) {
			navigate("/backoffice");
		}
	};

	return (
		<section className={style.authFormContainer}>
			<form>
				<div>
					<label htmlFor="username">
						{translation[language].backoffice.authPage.username}
					</label>
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
					<label htmlFor="password">
						{translation[language].backoffice.authPage.password}
					</label>
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
			<ButtonComponent
				type="button"
				color="brown"
				textContent={translation[language].backoffice.authPage.login}
				onClickFunction={handleConnectionButtonClick}
			/>
		</section>
	);
};

export default AuthFormComponent;
