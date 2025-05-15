// import des bibliothèques
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Select from "react-select";
// import des composants
import CommonForm from "../commonForm/CommonForm";
// import du contexte
import { TagOptionsContext } from "../../../../context/TagContext";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import {
	getAllStorymapLanguages,
	getStorymapInfosAndBlocksById,
} from "../../../../utils/api/storymap/getRequests";
import { storymapInputs } from "../../../../utils/forms/storymapInputArray";
import {
	createStorymap,
	updateStorymap,
} from "../../../../utils/api/storymap/postRequests";
import { createLanguageOptions } from "../../../../utils/functions/storymap";
// import des types
import type { SubmitHandler } from "react-hook-form";
import type {
	StorymapBodyType,
	StorymapLanguageType,
	StorymapType,
} from "../../../../utils/types/storymapTypes";
import type {
	InputType,
	storymapInputsType,
	allInputsType,
} from "../../../../utils/types/formTypes";
import type { OptionType } from "../../../../utils/types/commonTypes";
import type { TagType } from "../../../../utils/types/mapTypes";

type IntroductionFormProps = {
	setStep: (step: number) => void;
};

/**
 * Formulaire d'introduction à la création d'une storymap : définition du titre, de la description, de l'image de couverture, etc.
 * @param {setStep} props - la fonction pour changer d'étape
 * @returns CommonForm
 */
const IntroductionForm = ({ setStep }: IntroductionFormProps) => {
	// importation des données de traduction
	const { language } = useTranslation();

	const { tagOptions } = useContext(TagOptionsContext);

	// définition d'un état pour les inputs du formulaire
	const [inputs, setInputs] = useState<InputType[]>(storymapInputs);

	// au montage du composant, récupération des catégories et des langues pour les select/options
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const fetchAllLanguagesAndCreateOptions = async () => {
			const allLanguages: StorymapLanguageType[] =
				await getAllStorymapLanguages();
			// création des options pour le select des catégories
			const newInputs = createLanguageOptions(allLanguages, inputs);
			setInputs(newInputs);
		};

		fetchAllLanguagesAndCreateOptions();
	}, [language]);

	// -- MODE MODIFICATION --
	const { storymapId } = useParams();
	const [storymapInfos, setStorymapInfos] = useState<StorymapType | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	// récupération des données de la storymap
	useEffect(() => {
		const fetchStorymapInfos = async (storymapId: string) => {
			setIsLoaded(false);
			const response = await getStorymapInfosAndBlocksById(
				storymapId as string,
			);
			setStorymapInfos({ ...response });
			setIsLoaded(true);
		};
		if (storymapId !== "create") {
			fetchStorymapInfos(storymapId as string);
		}
	}, [storymapId]);

	// définition de la fonction de soumission du formulaire (création ou mise à jour de la storymap)
	const [selectedTags, setSelectedTags] = useState<string>("");
	const navigate = useNavigate();
	const onSubmit: SubmitHandler<storymapInputsType> = async (data) => {
		if (storymapId === "create") {
			const newStorymap = await createStorymap({ ...data, tags: selectedTags });
			setStorymapInfos(newStorymap);
			navigate(`/backoffice/storymaps/${newStorymap.id}`);
		} else {
			const bodyWithoutUselessData: StorymapBodyType = {
				id: storymapInfos?.id as string,
				title_lang1: data.title_lang1,
				title_lang2: data.title_lang2,
				description_lang1: data.description_lang1,
				description_lang2: data.description_lang2,
				category_id: data.category_id,
				image_url: data.image_url,
				author: data.author,
				lang1: data.lang1,
				lang2: data.lang2,
				publication_date: data.publication_date,
				tags: selectedTags
					? selectedTags
					: (storymapInfos?.tags as TagType[])
							.map((tag: TagType) => tag.id)
							.join("|"),
			};
			await updateStorymap(bodyWithoutUselessData, storymapInfos?.id as string);
		}
		setStep(2);
	};

	const defaultTagValues = useMemo(() => {
		return (storymapInfos?.tags as TagType[])?.map((tag: TagType) => ({
			value: tag.id,
			label: tag[`name_${language}`],
		}));
	}, [language, storymapInfos]);

	return (
		<>
			{storymapId === "create" && (
				<CommonForm
					onSubmit={onSubmit as SubmitHandler<allInputsType>}
					inputs={inputs}
					action="create"
				>
					<Select
						options={tagOptions}
						delimiter="|"
						isMulti
						onChange={(newValue) => {
							const tagIds = newValue
								.map((tag: OptionType) => tag.value as string)
								.join("|");
							setSelectedTags(tagIds);
						}}
						placeholder="Choisir une ou plusieurs étiquette"
					/>
				</CommonForm>
			)}
			{isLoaded && (
				<CommonForm
					onSubmit={onSubmit as SubmitHandler<allInputsType>}
					inputs={inputs}
					defaultValues={{ ...storymapInfos } as StorymapType}
					action="edit"
				>
					<Select
						options={tagOptions}
						defaultValue={storymapInfos ? defaultTagValues : []}
						delimiter="|"
						isMulti
						onChange={(newValue) => {
							const tagIds = newValue
								.map((tag: OptionType) => tag.value as string)
								.join("|");
							setSelectedTags(tagIds);
						}}
						placeholder="Choisir une ou plusieurs étiquette"
					/>
				</CommonForm>
			)}
		</>
	);
};

export default IntroductionForm;
