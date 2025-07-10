// import des bibliothèques
import { useEffect, useState } from "react";
// import des custom hooks
import { useTranslation } from "./useTranslation";
// import des services
import { getNoContentText } from "../api/translationAPI";

const useCustomNoContent = () => {
	const { language } = useTranslation();
	const [customNoContentText, setCustomNoContentText] = useState<
		Record<string, string>
	>({
		fr: "",
		en: "",
	});
	useEffect(() => {
		const fetchDatabaseNotFoundText = async () => {
			const noContentText = await getNoContentText();
			setCustomNoContentText(noContentText);
		};
		fetchDatabaseNotFoundText();
	}, [language]);

	return customNoContentText;
};

export default useCustomNoContent;
