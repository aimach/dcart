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

const NewPasswordPage = () => {
	const { language, translation } = useTranslation();

	const [searchParams, _] = useSearchParams();
	const token = searchParams.get("token");
	const email = searchParams.get("email");

	const [newPassword, setNewPassword] = useState("");

	const navigate = useNavigate();

	const [error, setError] = useState<string | null>(null);

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
		<div className={style.resetPasswordPage}>
			<h3>{translation[language].backoffice.authPage.newPassword}</h3>
			<input
				type="password"
				value={newPassword}
				onChange={(e) => setNewPassword(e.target.value)}
			/>
			{error && <p className={style.error}>{error}</p>}
			<ButtonComponent
				onClickFunction={handleSendReset}
				type="button"
				color="brown"
				textContent={translation[language].backoffice.authPage.saveNewPassword}
			/>
		</div>
	);
};

export default NewPasswordPage;
