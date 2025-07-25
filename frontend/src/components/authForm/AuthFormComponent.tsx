// import des bibliothèques
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import ErrorComponent from "../form/errorComponent/ErrorComponent";
import ButtonComponent from "../common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import du contexte
import { AuthContext } from "../../context/AuthContext";
// import des services
import { loginUser } from "../../utils/api/authAPI";
import { jwtService } from "../../utils/functions/auth";
// import des types
import type { User } from "../../utils/types/userTypes";
import type { SubmitHandler } from "react-hook-form";
import type { JwtPayload } from "jwt-decode";
// import du style
import style from "./authFormComponent.module.scss";
// import des icônes
import { EyeClosed, EyeIcon, TriangleAlert } from "lucide-react";

/**
 * Composant de formulaire d'authentification
 */
const AuthFormComponent = () => {
	const { language, translation } = useTranslation();

	const { setToken, setIsAdmin, setUserId } = useContext(AuthContext);

	const [displayError, setDisplayError] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	// fonction de gestion du bouton "Se connecter"
	const navigate = useNavigate();
	const handleConnectionButtonClick: SubmitHandler<User> = async (data) => {
		const loginUserResponse = await loginUser(data);
		if (loginUserResponse) {
			setToken(loginUserResponse.accessToken as string);
			if (loginUserResponse.accessToken) {
				const decodedToken = jwtService.verifyToken(
					loginUserResponse.accessToken as string,
				);
				if ((decodedToken as JwtPayload & { userStatus: string }).userStatus) {
					setIsAdmin(
						(decodedToken as JwtPayload & { userStatus: string }).userStatus ===
							"admin",
					);
					setUserId(
						(decodedToken as JwtPayload & { userId: string }).userId || null,
					);
				}
				navigate("/backoffice");
			}
		} else {
			setDisplayError(true);
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
					<label htmlFor="pseudo">
						{translation[language].backoffice.authPage.username}
					</label>
					<input
						type="text"
						id="pseudo"
						{...register("pseudo", { required: true })}
					/>
					{errors.pseudo && (
						<ErrorComponent
							message={translation[language].backoffice.authPage.requiredField}
						/>
					)}
				</div>
				<div className={style.commonFormInputContainer}>
					<label htmlFor="password">
						{translation[language].backoffice.authPage.password}
					</label>
					<div style={{ display: "flex", alignItems: "center", width: "100%" }}>
						<input
							type={showPassword ? "text" : "password"}
							id="password"
							{...register("password", { required: true })}
						/>
						<button
							type="button"
							onClick={() => setShowPassword((prev) => !prev)}
							style={{ marginLeft: 8 }}
							aria-label="Changer la visibilité du mot de passe"
						>
							{showPassword ? <EyeClosed /> : <EyeIcon />}
						</button>
					</div>

					{errors.password && (
						<ErrorComponent
							message={translation[language].backoffice.authPage.requiredField}
						/>
					)}
				</div>
				{displayError && (
					<div className={style.errorMessage}>
						<TriangleAlert />
						{translation[language].invalidAuth}
					</div>
				)}
				<ButtonComponent
					type="submit"
					color="brown"
					textContent={translation[language].backoffice.authPage.login}
				/>
				<Link to="/forgot-password">
					{translation[language].backoffice.authPage.forgotPassword}
				</Link>
			</form>
		</section>
	);
};

export default AuthFormComponent;
