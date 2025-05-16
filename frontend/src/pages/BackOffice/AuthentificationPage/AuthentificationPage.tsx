// import des composant
import { TriangleAlert } from "lucide-react";
import AuthFormComponent from "../../../components/authForm/AuthFormComponent";
// import des custom hooks
import { useWindowSize } from "../../../utils/hooks/useWindowSize";
import { useTranslation } from "../../../utils/hooks/useTranslation";

/**
 * Page d'authentification
 * @returns AuthFormComponent
 */
const AuthentificationPage = () => {
	const { isDesktop } = useWindowSize();

	const noAuthStyle: React.CSSProperties = {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100vh",
		gap: "2rem",
		textAlign: "center",
	};

	const { language, translation } = useTranslation();

	return isDesktop ? (
		<AuthFormComponent />
	) : (
		<section style={noAuthStyle}>
			<TriangleAlert width="30px" color="#9d2121" />
			<p>{translation[language].noAuthInMobile}</p>
		</section>
	);
};

export default AuthentificationPage;
