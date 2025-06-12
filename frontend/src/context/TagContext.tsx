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
	tags: TagType[];
	reloadTags: boolean;
	setReloadTags: (value: boolean) => void;
};

export const TagOptionsContext = createContext<TagOptionsContextType>({
	tagOptions: [],
	tags: [],
	reloadTags: false,
	setReloadTags: () => {},
});

interface TagOptionsProviderProps {
	children: ReactNode;
}

export const TagOptionsProvider = ({ children }: TagOptionsProviderProps) => {
	const { language } = useContext(TranslationContext);

	const [tags, setTags] = useState<TagType[]>([]);
	const [tagOptions, setTagOptions] = useState<OptionType[]>([]);
	const [reloadTags, setReloadTags] = useState(false);

	useEffect(() => {
		const fetchAllTags = async () => {
			const fetchedTags = await getAllTags();
			setTags(fetchedTags);

			const formatedTagOptions: OptionType[] = fetchedTags.map(
				(Tag: TagType) => ({
					value: Tag.id,
					label: Tag[`name_${language}`],
				}),
			);
			setTagOptions(formatedTagOptions);
		};
		fetchAllTags();
	}, [language, reloadTags]);

	return (
		<TagOptionsContext.Provider
			value={{ tagOptions, tags, reloadTags, setReloadTags }}
		>
			{children}
		</TagOptionsContext.Provider>
	);
};
