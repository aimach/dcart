// import des bibliothèques
import { useEffect, useState } from "react";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router";
// import des composants
import FormTitleComponent from "../common/FormTitleComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useShallow } from "zustand/shallow";
import {
	createBlock,
	updateBlock,
} from "../../../../utils/api/storymap/postRequests";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
} from "../../../../utils/functions/toast";
import {
	getAllMapsInfos,
	getAllStorymapsInfos,
} from "../../../../utils/api/builtMap/getRequests";
// import des types
import type { SubmitHandler } from "react-hook-form";
import type { MapType } from "../../../../utils/types/mapTypes";
import type { StorymapType } from "../../../../utils/types/storymapTypes";
import type { OptionType } from "../../../../utils/types/commonTypes";
// import du style
import style from "../commonForm/commonForm.module.scss";
// import des icônes
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ItemLinkFormInputs = {
	content1_lang1: string;
	content1_lang2: string;
};

/**
 * Formulaire pour la création d'un bloc de type "link"
 */
const ItemLinkForm = () => {
	const { translation, language } = useTranslation();

	const { updateFormType, block, reload, setReload } = useBuilderStore(
		useShallow((state) => state),
	);

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");

	const { storymapId } = useParams();

	// fonction appelée lors de la soumission du formulaire
	const onSubmit: SubmitHandler<ItemLinkFormInputs> = async (data) => {
		if (action === "create") {
			await createBlock({
				...data,
				storymapId: storymapId,
				typeName: "itemLink",
			});
			notifyCreateSuccess("Bloc lien de carte ou storymap", false);
		} else if (action === "edit") {
			await updateBlock(
				{
					...block,
					...data,
					storymapId: storymapId,
					typeName: "itemLink",
				},
				block?.id.toString() as string,
			);
			notifyEditSuccess("Bloc lien de carte ou storymap", false);
		}
		setReload(!reload);
		updateFormType("blockChoice");
		setSearchParams(undefined);
	};

	const [activeMaps, setActiveMaps] = useState<OptionType[]>([]);
	const [activeStorymaps, setActiveStorymaps] = useState<OptionType[]>([]);
	const [itemOptions, setItemOptions] = useState<OptionType[]>([]);
	useEffect(() => {
		const fetchMapInfos = async () => {
			const activeMaps = await getAllMapsInfos(true, "");
			const formatedMap = activeMaps.map((map: MapType) => ({
				label: map[`title_${language}`],
				value: map.id,
			}));
			setActiveMaps(formatedMap);
			if (!block || block?.content1_lang1 === "map") {
				setItemOptions(formatedMap);
			}
		};
		const fetchStorymapInfos = async () => {
			const activeStorymaps = await getAllStorymapsInfos(true, "");
			const formatedStorymap = activeStorymaps.map(
				(storymap: StorymapType) => ({
					label: storymap.title_lang1,
					value: storymap.id,
				}),
			);
			const optionsWithoutCurrentStorymap = formatedStorymap.filter(
				(storymapOption: OptionType) => storymapOption.value !== storymapId,
			);
			setActiveStorymaps(optionsWithoutCurrentStorymap);
			if (block?.content1_lang1 === "storymap") {
				setItemOptions(optionsWithoutCurrentStorymap);
			}
		};
		fetchMapInfos();
		fetchStorymapInfos();
	}, [language, block, storymapId]);

	// import des sevice de formulaire
	const { handleSubmit, setValue, watch } = useForm<ItemLinkFormInputs>({
		defaultValues: {
			content1_lang1: block?.content1_lang1 ?? "map",
		},
	});
	const [selectedItem, setSelectedItem] = useState<OptionType | null>(null);
	useEffect(() => {
		if (block?.content1_lang2) {
			const selectedOption =
				itemOptions.find((option) => option.value === block?.content1_lang2) ??
				itemOptions[0];
			setSelectedItem(selectedOption);
		}
	}, [block?.content1_lang2, itemOptions]);

	const isEditFormReady = action === "edit" && selectedItem;

	return (
		(action === "create" || isEditFormReady) && (
			<>
				<FormTitleComponent
					action={action as string}
					translationKey="itemLink"
				/>
				<form
					onSubmit={handleSubmit(onSubmit)}
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
									checked={watch("content1_lang1") === "map"}
									onChange={() => {
										setItemOptions(activeMaps);
										setValue("content1_lang1", "map");
										if (action === "edit") {
											setSelectedItem(activeMaps[0]);
										}
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
									checked={watch("content1_lang1") === "storymap"}
									onChange={() => {
										setItemOptions(activeStorymaps);
										setValue("content1_lang1", "storymap");
										if (action === "edit") {
											setSelectedItem(activeStorymaps[0]);
										}
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
							<Select
								options={itemOptions}
								placeholder="Sélectionner un élément"
								onChange={(newValue) =>
									setValue("content1_lang2", newValue?.value as string)
								}
								blurInputOnSelect
								defaultValue={selectedItem}
								isLoading={!itemOptions.length}
							/>
						</div>
					</div>
					<div className={style.commonFormContainerButton}>
						<ButtonComponent
							type="button"
							color="brown"
							textContent={translation[language].common.back}
							onClickFunction={() => {
								updateFormType("blockChoice");
								setSearchParams(undefined);
							}}
							icon={<ChevronLeft />}
						/>
						<ButtonComponent
							type="submit"
							color="brown"
							textContent={
								translation[language].backoffice.storymapFormPage.form[action]
							}
							icon={<ChevronRight />}
						/>
					</div>
				</form>
			</>
		)
	);
};

export default ItemLinkForm;
