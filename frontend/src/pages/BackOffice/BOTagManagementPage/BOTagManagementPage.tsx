// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import des composants
import LoaderComponent from "../../../components/common/loader/LoaderComponent";
import ModalComponent from "../../../components/common/modal/ModalComponent";
import TagInput from "./TagInput";
import DeleteTagContent from "../../../components/common/modal/DeleteTagContent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import du context
import { AuthContext } from "../../../context/AuthContext";
// import des services
import { getAllTags } from "../../../utils/api/builtMap/getRequests";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import des types
import type { TagType } from "../../../utils/types/mapTypes";
// import des styles
import style from "./tagManagementPage.module.scss";
import { useForm } from "react-hook-form";
import LabelComponent from "../../../components/form/inputComponent/LabelComponent";
import ErrorComponent from "../../../components/form/errorComponent/ErrorComponent";
import { addNewTag } from "../../../utils/api/builtMap/postRequests";
import { notifyCreateSuccess } from "../../../utils/functions/toast";
import ButtonComponent from "../../../components/common/button/ButtonComponent";

const TagManagementPage = () => {
	const { isAdmin } = useContext(AuthContext);

	const { translation, language } = useTranslation();

	const navigate = useNavigate();

	const { closeDeleteModal, isDeleteModalOpen, reload, setReload } =
		useModalStore();

	const [isCreateForm, setIsCreateForm] = useState(false);

	useEffect(() => {
		if (!isAdmin) {
			navigate("/backoffice");
		}
	}, [isAdmin, navigate]);

	const [tags, setTags] = useState<TagType[]>([]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: force le re-render pour le rafraîchissement de la liste
	useEffect(() => {
		const fetchAllTags = async () => {
			const fetchedTags = await getAllTags();
			setTags(fetchedTags);
		};
		fetchAllTags();
	}, [reload]);

	// import des sevice de formulaire
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TagType>();

	const handleCreateTag = async (data: TagType) => {
		const statusResponse = await addNewTag(data);
		if (statusResponse === 201) {
			setIsCreateForm(false);
			notifyCreateSuccess("Etiquette", true);
			setReload(!reload);
		}
	};

	return tags.length > 0 ? (
		<section className={style.tagManagementSection}>
			{isDeleteModalOpen && (
				<ModalComponent onClose={() => closeDeleteModal()}>
					<DeleteTagContent />
				</ModalComponent>
			)}
			<h4>{translation[language].backoffice.tagManagement.title}</h4>
			<div>
				{isCreateForm ? (
					<ButtonComponent
						type="button"
						textContent={translation[language].button.cancel}
						color="brown"
						onClickFunction={() => setIsCreateForm(!isCreateForm)}
					/>
				) : (
					<ButtonComponent
						type="button"
						textContent={translation[language].button.add}
						color="brown"
						onClickFunction={() => setIsCreateForm(!isCreateForm)}
					/>
				)}
			</div>

			<div className={style.tagManagementContainer}>
				{isCreateForm ? (
					<form onSubmit={handleSubmit(handleCreateTag)}>
						<div className={style.tagManagementForm}>
							<div className={style.tagManagementRow}>
								<div className={style.tagInputContainer}>
									<LabelComponent
										htmlFor="name_fr"
										label="Nom en français"
										description=""
									/>
									<input
										type="text"
										id="name_fr"
										{...register("name_fr", {
											required: "Le champ du nom en français est requis",
										})}
									/>
								</div>
								<div className={style.tagInputContainer}>
									<LabelComponent
										htmlFor="name_en"
										label="Nom en anglais"
										description=""
									/>
									<input
										type="text"
										id="name_en"
										{...register("name_en", {
											required: "Le champ du nom en anglais est requis",
										})}
									/>
								</div>
							</div>
							<div className={style.tagManagementRow}>
								<div className={style.tagInputContainer}>
									<LabelComponent
										htmlFor="description_fr"
										label="Description en français"
										description=""
									/>
									<input
										type="text"
										id="description_fr"
										{...register("description_fr")}
									/>
								</div>
								<div className={style.tagInputContainer}>
									<LabelComponent
										htmlFor="description_en"
										label="Description en anglais"
										description=""
									/>
									<input
										type="text"
										id="description_en"
										{...register("description_en")}
									/>
								</div>
							</div>
							<ButtonComponent
								type="button"
								color="brown"
								textContent={translation[language].button.add}
								onClickFunction={handleSubmit(handleCreateTag)}
							/>

							{Object.keys(errors).length > 0 && (
								<ErrorComponent
									message={errors[Object.keys(errors)[0]].message}
								/>
							)}
						</div>
					</form>
				) : (
					tags.map((tag) => {
						return <TagInput tag={tag} key={tag.id} />;
					})
				)}
			</div>
		</section>
	) : (
		<LoaderComponent size={40} />
	);
};

export default TagManagementPage;
