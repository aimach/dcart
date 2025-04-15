// import des bibliothèques
import { createContext, useContext, useEffect, useState } from "react";
// import des services
import { getAllCategories } from "../utils/api/builtMap/getRequests";
import { TranslationContext } from "./TranslationContext";
// import des types
import type { ReactNode } from "react";
import type { OptionType } from "../utils/types/commonTypes";
import type { CategoryType } from "../utils/types/mapTypes";

type CategoryOptionsContextType = {
	categoryOptions: OptionType[];
}


export const CategoryOptionsContext = createContext<CategoryOptionsContextType>({
	categoryOptions: []
});

interface CategoryOptionsProviderProps {
	children: ReactNode;
}

export const CategoryOptionsProvider = ({ children }: CategoryOptionsProviderProps) => {
	const { language } = useContext(TranslationContext)

	const [categoryOptions, setCategoryOptions] = useState<OptionType[]>([]);

	useEffect(() => {
		const fetchAllCategories = async () => {
			const fetchedCategories = await getAllCategories();
			const formatedCategoryOptions: OptionType[] = fetchedCategories.map(
				(category: CategoryType) => ({
					value: category.id,
					label: category[`name_${language}`],
				}),
			);
			setCategoryOptions(formatedCategoryOptions);
		};
		fetchAllCategories();
	}, [language]);

	return (
		<CategoryOptionsContext.Provider value={{ categoryOptions }}>
			{children}
		</CategoryOptionsContext.Provider>
	);
};
