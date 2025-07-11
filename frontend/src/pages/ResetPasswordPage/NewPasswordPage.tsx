// import des bibliothèques
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
// import des composants
import ButtonComponent from "../../components/common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import des services
import { resetPassword } from "../../utils/api/authAPI";
// import du style
import style from "./ResetPasswordPage.module.scss";
// import des icônes
import { EyeClosed, EyeIcon } from "lucide-react";
import { ResetPasswordPageHelmetContent } from "../../components/helmet/HelmetContent";

const NewPasswordPage = () => {
	const { language, translation } = useTranslation();

	const [searchParams, _] = useSearchParams();
	const token = searchParams.get("token");
	const email = searchParams.get("email");

	const [newPassword, setNewPassword] = useState("");

	const navigate = useNavigate();

	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const handleSendReset = async () => {
		if (newPassword && token && email) {
			const response = await resetPassword(email, token, newPassword);
			if (response.message) {
				setError(response.message);
			} else {
				navigate("/authentification");
			}
		}
	};

	return (
		<>
			<ResetPasswordPageHelmetContent />
			<div className={style.resetPasswordPage}>
				<h3>{translation[language].backoffice.authPage.newPassword}</h3>
				<div style={{ display: "flex", alignItems: "center" }}>
					<input
						type={showPassword ? "text" : "password"}
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
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
				{error ? (
					<p className={style.error}>{error}</p>
				) : (
					<p>
						Le mot de passe doit contenir au moins 10 caractères, une majuscule,
						une minuscule et un chiffre.
					</p>
				)}
				<ButtonComponent
					onClickFunction={handleSendReset}
					type="button"
					color="brown"
					textContent={
						translation[language].backoffice.authPage.saveNewPassword
					}
				/>
			</div>
		</>
	);
};

export default NewPasswordPage;
