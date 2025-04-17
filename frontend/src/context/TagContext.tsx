// import des bibliothèques
import { createContext, useContext, useEffect, useState } from "react";
// import des services
import { getAllTags } from "../utils/api/builtMap/getRequests";
import { TranslationContext } from "./TranslationContext";
// import des types
import type { ReactNode } from "react";
import type { OptionType } from "../utils/types/commonTypes";
import type { TagType } from "../utils/types/mapTypes";

type TagOptionsContextType = {
	tagOptions: OptionType[];
};

export const TagOptionsContext = createContext<TagOptionsContextType>({
	tagOptions: [],
});

interface TagOptionsProviderProps {
	children: ReactNode;
}

export const TagOptionsProvider = ({ children }: TagOptionsProviderProps) => {
	const { language } = useContext(TranslationContext);

	const [tagOptions, setTagOptions] = useState<OptionType[]>([]);

	useEffect(() => {
		const fetchAllTags = async () => {
			const fetchedTags = await getAllTags();
			const formatedTagOptions: OptionType[] = fetchedTags.map(
				(Tag: TagType) => ({
					value: Tag.id,
					label: Tag[`name_${language}`],
				}),
			);
			setTagOptions(formatedTagOptions);
		};
		fetchAllTags();
	}, [language]);

	return (
		<TagOptionsContext.Provider value={{ tagOptions }}>
			{children}
		</TagOptionsContext.Provider>
	);
};
