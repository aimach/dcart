// import des bibliothèques
import { useParams, useSearchParams } from "react-router";
// import des composants
import FormTitleComponent from "../common/FormTitleComponent";
// import du context
// import des services
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useShallow } from "zustand/shallow";
import {
	createBlock,
	updateBlock,
} from "../../../../utils/api/storymap/postRequests";
// import des types
import { set, type SubmitHandler } from "react-hook-form";
import type { allInputsType } from "../../../../utils/types/formTypes";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
} from "../../../../utils/functions/toast";
// import du style
import style from "../commonForm/commonForm.module.scss";
import LabelComponent from "../../inputComponent/LabelComponent";
import { useTranslation } from "../../../../utils/hooks/useTranslation";
import MultiSelectComponent from "../../../common/multiSelect/MultiSelectComponent";
import { useEffect, useState } from "react";
import type { MapType } from "../../../../utils/types/mapTypes";
import type { StorymapType } from "../../../../utils/types/storymapTypes";
import {
	getAllMapsInfos,
	getAllStorymapsInfos,
} from "../../../../utils/api/builtMap/getRequests";

export type ItemLinkFormInputs = {
	content1_lang1: string;
};

/**
 * Formulaire pour la création d'un bloc de type "link"
 */
const ItemLinkForm = () => {
	const { translation, language } = useTranslation();

	const { updateFormType, block, reload, setReload } = useBuilderStore(
		useShallow((state) => ({
			block: state.block,
			updateFormType: state.updateFormType,
			reload: state.reload,
			setReload: state.setReload,
		})),
	);

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");

	const { storymapId } = useParams();

	// fonction appelée lors de la soumission du formulaire
	// const onSubmit: SubmitHandler<ItemLinkFormInputs> = async (data) => {
	// 	if (action === "create") {
	// 		await createBlock({
	// 			...data,
	// 			content1_lang2: data.content1_lang1,
	// 			storymapId: storymapId,
	// 			typeName: "link",
	// 		});
	// 		notifyCreateSuccess("Bloc lien", false);
	// 	} else if (action === "edit") {
	// 		await updateBlock(
	// 			{
	// 				...block,
	// 				...data,
	// 				content1_lang2: data.content1_lang1,
	// 				storymapId: storymapId,
	// 				typeName: "link",
	// 			},
	// 			block?.id.toString() as string,
	// 		);
	// 		notifyEditSuccess("Bloc lien", false);
	// 	}
	// 	setReload(!reload);
	// 	updateFormType("blockChoice");
	// 	setSearchParams(undefined);
	// };

	const [selectedType, setSelectedType] = useState("map");

	const [activeMaps, setActiveMaps] = useState<MapType[]>([]);
	const [activeStorymaps, setActiveStorymaps] = useState<StorymapType[]>([]);
	const [itemOptions, setItemOptions] = useState<MapType[] | StorymapType[]>(
		[] as MapType[] | StorymapType[],
	);
	useEffect(() => {
		const fetchMapInfos = async () => {
			const activeMaps = await getAllMapsInfos(true);
			const formatedMap = activeMaps.map((map: MapType) => ({
				label: map[`title_${language}`],
				value: map.id,
			}));
			setActiveMaps(formatedMap);
		};
		const fetchStorymapInfos = async () => {
			const activeStorymaps = await getAllStorymapsInfos(true);
			const formatedStorymap = activeStorymaps.map(
				(storymap: StorymapType) => ({
					label: storymap.title_lang1,
					value: storymap.id,
				}),
			);
			setActiveStorymaps(formatedStorymap);
		};
		fetchMapInfos();
		fetchStorymapInfos();
	}, [language]);

	return (
		<>
			<FormTitleComponent action={action as string} translationKey="itemLink" />
			<form
				// onSubmit={handleSubmit(onSubmit)}
				className={style.commonFormContainer}
			>
				<div className={style.commonFormInputContainer}>
					<LabelComponent
						label="Type de contenu"
						description="Choisir entre une carte ou un storymap"
						htmlFor="content1_lang1"
					/>
					<div className={style.inputContainer}>
						<div>
							<input
								type="radio"
								id="content1_lang1"
								name="itemType"
								value="map"
								checked={selectedType === "map"}
								onChange={() => {
									setSelectedType("map");
									setItemOptions(activeMaps);
								}}
							/>
							<label htmlFor="content1_lang1">
								{translation[language].common.map}
							</label>
						</div>
						<div>
							<input
								type="radio"
								id="content1_lang1"
								name="itemType"
								value="storymap"
								checked={selectedType === "storymap"}
								onChange={() => {
									setSelectedType("storymap");
									setItemOptions(activeStorymaps);
								}}
							/>
							<label htmlFor="content1_lang1">
								{translation[language].common.storymap}
							</label>
						</div>
					</div>
				</div>
				<div className={style.commonFormInputContainer}>
					<LabelComponent
						label="Contenu à afficher"
						description="Sélectionner dans la liste déroulante (seuls les éléments déjà publiés sont affichés)"
						htmlFor="content1_lang2"
					/>
					<div className={style.inputContainer}>
						<MultiSelectComponent
							options={itemOptions}
							selectKey=""
							placeholder="Sélectionner..."
							handleChange={() => console.log("coucou")}
						/>
					</div>
				</div>
			</form>
		</>
	);
};

export default ItemLinkForm;
