// import des bibliothèques
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router";
// import des composants
import CommonForm from "../commonForm/CommonForm";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import {
	getAllStorymapCategories,
	getAllStorymapLanguages,
	getStorymapInfosAndBlocks,
} from "../../../../utils/api/storymap/getRequests";
import { storymapInputs } from "../../../../utils/forms/storymapInputArray";
import {
	createStorymap,
	updateStorymap,
} from "../../../../utils/api/storymap/postRequests";
// import des types
import type { SubmitHandler } from "react-hook-form";
import type {
	CategoryType,
	StorymapLanguageType,
	StorymapType,
} from "../../../../utils/types/storymapTypes";
import type {
	InputType,
	storymapInputsType,
	allInputsType,
} from "../../../../utils/types/formTypes";
import {
	createCategoryOptions,
	createLanguageOptions,
} from "../../../../utils/functions/storymap";

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

	// définition d'un état pour les inputs du formulaire
	const [inputs, setInputs] = useState<InputType[]>(storymapInputs);

	// au montage du composant, récupération des catégories et des langues pour les select/options
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const fetchAllCategoriesAndCreateOptions = async () => {
			try {
				const allCategories: CategoryType[] = await getAllStorymapCategories();
				// création des options pour le select des catégories
				const newInputs = createCategoryOptions(
					allCategories,
					language,
					inputs,
				);
				setInputs(newInputs);
			} catch (error) {
				console.error(error);
			}
		};
		const fetchAllLanguagesAndCreateOptions = async () => {
			try {
				const allLanguages: StorymapLanguageType[] =
					await getAllStorymapLanguages();
				// création des options pour le select des catégories
				const newInputs = createLanguageOptions(allLanguages, inputs);
				setInputs(newInputs);
			} catch (error) {
				console.error(error);
			}
		};
		fetchAllCategoriesAndCreateOptions();
		fetchAllLanguagesAndCreateOptions();
	}, [language]);

	// -- MODE MODIFICATION --
	const { storymapId } = useParams();
	const [storymapInfos, setStorymapInfos] = useState<StorymapType | null>(null);

	// récupération des données de la storymap
	useEffect(() => {
		const fetchStorymapInfos = async (storymapId: string) => {
			const response = await getStorymapInfosAndBlocks(storymapId as string);
			setStorymapInfos({ ...response, category_id: response.category.id });
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
			setStorymapInfos(newStorymap);
			navigate(`/backoffice/storymaps/${newStorymap.id}`);
		} else {
			await updateStorymap(data, storymapInfos?.id as string);
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
			{storymapId !== "create" && storymapInfos && (
				<CommonForm
					onSubmit={onSubmit as SubmitHandler<allInputsType>}
					inputs={inputs}
					defaultValues={storymapInfos as StorymapType}
					action="edit"
				/>
			)}
		</>
	);
};

export default IntroductionForm;
