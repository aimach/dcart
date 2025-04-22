// import des bibliothèques
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
// import du context
import { AuthContext } from "../../../context/AuthContext";

const BackofficeTranslationPage = () => {
	const { isAdmin } = useContext(AuthContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (!isAdmin) {
			navigate("/backoffice");
		}
	}, [isAdmin, navigate]);

	return <div>Page de la traduction</div>;
};

export default BackofficeTranslationPage;
