// import des bibliothèques
import { useState } from "react";
import { useNavigate } from "react-router";
// import des composants
import ButtonComponent from "../../components/common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import des services
import { sendResetPasswordRequest } from "../../utils/api/authAPI";
// import du style
import style from "./ResetPasswordPage.module.scss";

const ResetPasswordPage = () => {
	const { language, translation } = useTranslation();

	const [email, setEmail] = useState("");

	const navigate = useNavigate();

	const handleSendReset = async () => {
		if (email) {
			await sendResetPasswordRequest(email);
			navigate("/authentification");
		}
	};

	return (
		<div className={style.resetPasswordPage}>
			<h3>{translation[language].backoffice.authPage.forgotPassword}</h3>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder={translation[language].backoffice.authPage.enterEmail}
			/>

			<ButtonComponent
				onClickFunction={handleSendReset}
				type="button"
				color="brown"
				textContent={translation[language].backoffice.authPage.sendResetLink}
			/>
		</div>
	);
};

export default ResetPasswordPage;
