// import des composants
import SwiperContainer from "../../../common/swiper/SwiperContainer";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useEffect, useState } from "react";
import { allStorymapsFromTag } from "../../../../utils/api/storymap/getRequests";
// import des types
import type { StorymapType } from "../../../../utils/types/storymapTypes";
import type { TagType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./storymapConclusion.module.scss";

interface StorymapConclusionProps {
	storymapInfos: StorymapType;
}

const StorymapConclusion = ({ storymapInfos }: StorymapConclusionProps) => {
	const { translation, language } = useTranslation();
	const [otherStorymaps, setOtherStorymaps] = useState<StorymapType[]>([]);

	useEffect(() => {
		if (storymapInfos.tags?.length === 0) {
			return;
		}

		const getAnotherStorymaps = async () => {
			const results = await Promise.all(
				(storymapInfos.tags as TagType[]).map(async (tag) => {
					return await allStorymapsFromTag(tag.id);
				}),
			);
			const filteredResults = results
				.flat()
				.filter(
					(storymap) => storymap.isActive && storymap.id !== storymapInfos.id,
				);
			setOtherStorymaps(filteredResults);
		};
		getAnotherStorymaps();
	}, [storymapInfos.tags, storymapInfos.id]);

	return (
		otherStorymaps.length > 0 && (
			<section className={style.conclusionContainer}>
				<h4>{translation[language].seeAlso.toUpperCase()}</h4>
				<div className={style.storymapContainer}>
					<SwiperContainer items={otherStorymaps} />
				</div>
			</section>
		)
	);
};

export default StorymapConclusion;
