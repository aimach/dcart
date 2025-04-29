// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import des composants
import LoaderComponent from "../../../components/common/loader/LoaderComponent";
import ButtonComponent from "../../../components/common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import du context
import { AuthContext } from "../../../context/AuthContext";
// import des services
import { getTranslations } from "../../../utils/api/translationAPI";
// import des types
import type { TranslationObjectType } from "../../../utils/types/languageTypes";
// import des styles
import style from "./BOTranslationPage.module.scss";

const BackofficeTranslationPage = () => {
	const { translation, language } = useTranslation();

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
			{databaseTranslations.map((translationObject) => {
				return (
					<div
						key={translationObject.id}
						className={style.translationContainer}
					>
						<h3>
							{translationObject.language === "fr"
								? "Traduction française"
								: "Traduction anglaise"}
						</h3>
						{Object.entries(translationObject.translations).map(
							([key, value]) => {
								if (key === "id" || key === "language") {
									return null;
								}
								return (
									<div key={key} className={style.translationInputContainer}>
										<h4>
											{
												translation[language].backoffice.translationManagement[
													key
												]
											}
										</h4>
										<div className={style.inputAndButton}>
											<textarea
												defaultValue={value as string}
												onChange={() => console.log(key)}
											/>
											<ButtonComponent
												type="button"
												color="brown"
												onClickFunction={() => console.log(key)}
												textContent="Modifier"
											/>
										</div>
									</div>
								);
							},
						)}
					</div>
				);
			})}
		</section>
	) : (
		<LoaderComponent size={50} />
	);
};

export default BackofficeTranslationPage;
