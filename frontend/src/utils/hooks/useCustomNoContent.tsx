// import des bibliothèques
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
// import des custom hooks
import { useTranslation } from "./useTranslation";
// import des services
import { getNoContentText } from "../api/translationAPI";

const useCustomNoContent = () => {
	const { language } = useTranslation();
	const [customNoContentText, setCustomNoContentText] = useState<string>("");
	useEffect(() => {
		const fetchDatabaseNotFoundText = async () => {
			const noContentText = await getNoContentText();
			const sanitizedNoContentText = DOMPurify.sanitize(
				noContentText[`content_${language}`] || "",
			);
			setCustomNoContentText(sanitizedNoContentText);
		};
		fetchDatabaseNotFoundText();
	}, [language]);

	return customNoContentText;
};

export default useCustomNoContent;
