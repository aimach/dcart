// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
// import des composants
import CommonForm from "../commonForm/CommonForm";
// import du contexte
import { CategoryOptionsContext } from "../../../../context/CategoryContext";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import {
	getAllStorymapLanguages,
	getRelatedMapId,
	getStorymapInfosAndBlocks,
} from "../../../../utils/api/storymap/getRequests";
import { storymapInputs } from "../../../../utils/forms/storymapInputArray";
import {
	createStorymap,
	updateStorymap,
} from "../../../../utils/api/storymap/postRequests";
import { getAllMapsInfos } from "../../../../utils/api/builtMap/getRequests";
import {
	createCategoryOptions,
	createLanguageOptions,
	createMapOptions,
} from "../../../../utils/functions/storymap";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
} from "../../../../utils/functions/toast";
import { addStorymapLinkToMap } from "../../../../utils/api/builtMap/postRequests";
// import des types
import type { SubmitHandler } from "react-hook-form";
import type {
	StorymapLanguageType,
	StorymapType,
} from "../../../../utils/types/storymapTypes";
import type {
	InputType,
	storymapInputsType,
	allInputsType,
} from "../../../../utils/types/formTypes";

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

	const { categoryOptions } = useContext(CategoryOptionsContext);

	// définition d'un état pour les inputs du formulaire
	const [inputs, setInputs] = useState<InputType[]>(storymapInputs);
	const [relatedMapId, setRelatedMapId] = useState<string | null>(null);

	// au montage du composant, récupération des catégories et des langues pour les select/options
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const addCategoryOptions = async () => {
			const newInputs = createCategoryOptions(categoryOptions, inputs);
			setInputs(newInputs);
		};
		const fetchAllLanguagesAndCreateOptions = async () => {
			const allLanguages: StorymapLanguageType[] =
				await getAllStorymapLanguages();
			// création des options pour le select des catégories
			const newInputs = createLanguageOptions(allLanguages, inputs);
			setInputs(newInputs);
		};
		const fetchAllMaps = async () => {
			const allMaps = await getAllMapsInfos(false);
			const newInputs = createMapOptions(allMaps, inputs, language);
			setInputs(newInputs);
		};
		const fetchRelatedMapId = async (storymapId: string) => {
			const relatedMap = await getRelatedMapId(storymapId as string);
			setRelatedMapId(relatedMap);
		};
		fetchAllMaps();
		addCategoryOptions();
		fetchAllLanguagesAndCreateOptions();
		if (storymapId !== "create") {
			fetchRelatedMapId(storymapId as string);
		}
	}, [language]);

	// -- MODE MODIFICATION --
	const { storymapId } = useParams();
	const [storymapInfos, setStorymapInfos] = useState<StorymapType | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	// récupération des données de la storymap
	useEffect(() => {
		const fetchStorymapInfos = async (storymapId: string) => {
			setIsLoaded(false);
			const response = await getStorymapInfosAndBlocks(storymapId as string);
			setStorymapInfos({ ...response, category_id: response.category.id });
			setIsLoaded(true);
		};
		if (storymapId !== "create") {
			fetchStorymapInfos(storymapId as string);
		}
	}, [storymapId]);

	// définition de la fonction de soumission du formulaire (création ou mise à jour de la storymap)
	const navigate = useNavigate();
	const onSubmit: SubmitHandler<storymapInputsType> = async (data) => {
		if (storymapId === "create") {
			const newStorymap = await createStorymap(data);
			await addStorymapLinkToMap(newStorymap.id, data.relatedMap as string);
			setStorymapInfos(newStorymap);
			notifyCreateSuccess("Storymap", true);
			navigate(`/backoffice/storymaps/${newStorymap.id}`);
		} else {
			const bodyWithoutUselessData = {
				id: storymapInfos?.id,
				title_lang1: data.title_lang1,
				title_lang2: data.title_lang2,
				description_lang1: data.description_lang1,
				description_lang2: data.description_lang2,
				category_id: data.category_id,
				img_url: data.img_url,
				author: data.author,
				lang1: data.lang1,
				lang2: data.lang2,
				publication_date: data.publication_date,
			};
			await updateStorymap(bodyWithoutUselessData, storymapInfos?.id as string);
			await addStorymapLinkToMap(
				storymapInfos?.id as string,
				data.relatedMap as string,
			);
			notifyEditSuccess("Storymap", true);
		}
		setStep(2);
	};

	return (
		<>
			{storymapId === "create" && (
				<CommonForm
					onSubmit={onSubmit as SubmitHandler<allInputsType>}
					inputs={inputs}
					action="create"
				/>
			)}
			{isLoaded && (
				<CommonForm
					onSubmit={onSubmit as SubmitHandler<allInputsType>}
					inputs={inputs}
					defaultValues={
						{ ...storymapInfos, relatedMap: relatedMapId } as StorymapType
					}
					action="edit"
				/>
			)}
		</>
	);
};

export default IntroductionForm;
