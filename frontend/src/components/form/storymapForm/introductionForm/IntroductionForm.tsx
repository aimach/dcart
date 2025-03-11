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
	getStorymapInfosAndBlocks,
} from "../../../../utils/api/storymap/getRequests";
import { storymapInputs } from "../../../../utils/forms/storymapInputArray";
import {
	createStorymap,
	updateStorymap,
} from "../../../../utils/api/storymap/postRequests";
// import des types
import type { SubmitHandler } from "react-hook-form";
import type { CategoryType } from "../../../../utils/types/storymapTypes";
import type {
	InputType,
	storymapInputsType,
	allInputsType,
} from "../../../../utils/types/formTypes";
import { createCategoryOptions } from "../../../../utils/functions/storymap";

/**
 * Formulaire d'introduction à la création d'une storymap : définition du titre, de la description, de l'image de couverture, etc.
 * @returns CommonForm
 */
const IntroductionForm = () => {
	// importation des données de traduction
	const { language } = useTranslation();

	// récupération de l'action en cours (création ou modification)
	const location = useLocation();
	const isEditForm = location.pathname.includes("edit");
	const isCreateForm = location.pathname.includes("create");

	const navigate = useNavigate();

	// définition d'un état pour les inputs du formulaire
	const [inputs, setInputs] = useState<InputType[]>(storymapInputs);

	// au montage du composant, récupération des catégories pour le select/options
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
		fetchAllCategoriesAndCreateOptions();
	}, [language]);

	// -- MODE MODIFICATION --
	// récupération de l'id de la storymap
	const { storymapId } = useParams();

	// définition d'un état pour stocker les informations de la storymap
	const [storymapInfos, setStorymapInfos] = useState<storymapInputsType | null>(
		null,
	);

	// récupération des données de la storymap
	useEffect(() => {
		const fetchStorymapInfos = async (storymapId: string) => {
			const response = await getStorymapInfosAndBlocks(storymapId as string);
			setStorymapInfos({ ...response, category_id: response.category.id });
		};
		if (storymapId) {
			fetchStorymapInfos(storymapId);
		}
	}, [storymapId]);

	// définition de la fonction de soumission du formulaire (création ou mise à jour de la storymap)
	const onSubmit: SubmitHandler<storymapInputsType> = async (data) => {
		if (isCreateForm) {
			const newStorymapId = await createStorymap(data);
			navigate(`/backoffice/storymaps/build/${newStorymapId}`);
		} else {
			await updateStorymap(data, storymapId as string);
			navigate(`/backoffice/storymaps/build/${storymapId}`);
		}
	};

	return (
		<>
			{isEditForm && storymapInfos && (
				<>
					<Link to={`/backoffice/storymaps/build/${storymapId}`}>
						Retour aux blocs
					</Link>
					<CommonForm
						onSubmit={onSubmit as SubmitHandler<allInputsType>}
						inputs={inputs}
						defaultValues={storymapInfos}
						action="edit"
					/>
				</>
			)}

			{isCreateForm && (
				<CommonForm
					onSubmit={onSubmit as SubmitHandler<allInputsType>}
					inputs={inputs}
					action="create"
				/>
			)}
		</>
	);
};

export default IntroductionForm;
