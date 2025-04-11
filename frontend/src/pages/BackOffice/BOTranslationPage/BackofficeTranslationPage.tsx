import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router";

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
