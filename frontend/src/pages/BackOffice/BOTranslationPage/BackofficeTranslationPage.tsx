// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import des composants
import LoaderComponent from "../../../components/common/loader/LoaderComponent";
import TranslationInput from "./TranslationInput";
// import du context
import { AuthContext } from "../../../context/AuthContext";
// import des services
import { getTranslations } from "../../../utils/api/translationAPI";
// import des types
import type { TranslationObjectType } from "../../../utils/types/languageTypes";
// import des styles
import style from "./BOTranslationPage.module.scss";

const BackofficeTranslationPage = () => {
	const { isAdmin } = useContext(AuthContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (!isAdmin) {
			navigate("/backoffice");
		}
	}, [isAdmin, navigate]);

	const [databaseTranslations, setDatabaseTranslations] = useState<
		TranslationObjectType[]
	>([]);
	useEffect(() => {
		const fetchTranslations = async () => {
			const translations = await getTranslations();
			setDatabaseTranslations(translations);
		};

		fetchTranslations();
	}, []);

	return databaseTranslations.length > 0 ? (
		<section className={style.translationPageContainer}>
			<div className={style.translationContainer}>
				{databaseTranslations.map((translation) => (
					<TranslationInput
						key={translation.key}
						translationObject={translation}
					/>
				))}
			</div>
		</section>
	) : (
		<LoaderComponent />
	);
};

export default BackofficeTranslationPage;
