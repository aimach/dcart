// import des bibliothèques
import { useContext } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import du contexte
import { AuthContext } from "../../context/AuthContext";
// import des services
import { loginUser } from "../../utils/api/authAPI";
// import des types
import type { User } from "../../utils/types/userTypes";
// import du style
import style from "./authFormComponent.module.scss";
import type { SubmitHandler } from "react-hook-form";
import ErrorComponent from "../form/errorComponent/ErrorComponent";

/**
 * Composant de formulaire d'authentification
 */
const AuthFormComponent = () => {
	const { language, translation } = useTranslation();

	const { setToken } = useContext(AuthContext);

	// fonction de gestion du bouton "Se connecter"
	const navigate = useNavigate();
	const handleConnectionButtonClick: SubmitHandler<User> = async (data) => {
		const loginUserResponse = await loginUser(data);
		setToken(loginUserResponse.accessToken as string);
		if (loginUserResponse.accessToken) {
			navigate("/backoffice");
		}
	};

	// import des services du formulaire
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<User>();

	return (
		<section className={style.authFormContainer}>
			<form
				className={style.authForm}
				onSubmit={handleSubmit(handleConnectionButtonClick)}
			>
				<div className={style.commonFormInputContainer}>
					<label htmlFor="username">
						{translation[language].backoffice.authPage.username}
					</label>
					<input
						type="text"
						id="username"
						{...register("username", { required: true })}
					/>
					{errors.username && (
						<ErrorComponent
							message={translation[language].backoffice.authPage.requiredField}
						/>
					)}
				</div>
				<div className={style.commonFormInputContainer}>
					<label htmlFor="password">
						{translation[language].backoffice.authPage.password}
					</label>
					<input
						type="password"
						id="password"
						{...register("password", { required: true })}
					/>
					{errors.password && (
						<ErrorComponent
							message={translation[language].backoffice.authPage.requiredField}
						/>
					)}
				</div>
				<button type="submit">
					{translation[language].backoffice.authPage.login}
				</button>
			</form>
		</section>
	);
};

export default AuthFormComponent;
