// import des bibliothèques
import { useForm } from "react-hook-form";
// import des composants
import LabelComponent from "../../../components/form/inputComponent/LabelComponent";
import ButtonComponent from "../../../components/common/button/ButtonComponent";
import ErrorComponent from "../../../components/form/errorComponent/ErrorComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { notifyEditSuccess, notifyError } from "../../../utils/functions/toast";
import { updateTag } from "../../../utils/api/builtMap/putRequests";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import des types
import type { TagType } from "../../../utils/types/mapTypes";
// import du style
import style from "./tagManagementPage.module.scss";

type TagInputProps = {
	tag: TagType;
};

const TagInput = ({ tag }: TagInputProps) => {
	const { translation, language } = useTranslation();

	const { setReload, reload, openDeleteModal, setIdToDelete } = useModalStore();

	// import des sevice de formulaire
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TagType>({
		defaultValues: tag ?? {},
	});

	const handleTagUpdate = async (data: TagType) => {
		const statusResponse = await updateTag(data);
		if (statusResponse === 200) {
			notifyEditSuccess("Etiquette", true);
			setReload(!reload);
		} else {
			notifyError("Erreur lors de la mise à jour de l'étiquette");
		}
	};

	const handleDeleteClick = (tagId: string) => {
		openDeleteModal();
		setIdToDelete(tagId);
	};

	return (
		<form onSubmit={handleSubmit(handleTagUpdate)}>
			<div key={tag.id} className={style.tagManagementForm}>
				<div className={style.tagManagementRow}>
					<div className={style.tagInputContainer}>
						<LabelComponent
							htmlFor="name_fr"
							label="Nom en français :"
							description=""
						/>
						<input
							type="text"
							id="name_fr"
							defaultValue={tag.name_fr}
							{...register("name_fr", {
								required: "Le champ du nom en français est requis",
							})}
						/>
					</div>
					<div className={style.tagInputContainer}>
						<LabelComponent
							htmlFor="name_en"
							label="Nom en anglais :"
							description=""
						/>
						<input
							type="text"
							id="name_en"
							defaultValue={tag.name_en}
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
							label="Description en français :"
							description=""
						/>
						<textarea
							id="description_fr"
							defaultValue={tag.description_fr}
							{...register("description_fr")}
						/>
					</div>
					<div className={style.tagInputContainer}>
						<LabelComponent
							htmlFor="description_en"
							label="Description en anglais :"
							description=""
						/>
						<textarea
							id="description_en"
							defaultValue={tag.description_en}
							{...register("description_en")}
						/>
					</div>
				</div>
				{Object.keys(errors).length > 0 && (
					<ErrorComponent message={errors[Object.keys(errors)[0]].message} />
				)}
			</div>
			<div className={style.buttonContainer}>
				<ButtonComponent
					type="button"
					color="brown"
					textContent={translation[language].button.edit}
					onClickFunction={handleSubmit(handleTagUpdate)}
				/>
				<ButtonComponent
					type="button"
					color="red"
					textContent={translation[language].button.delete}
					onClickFunction={() => handleDeleteClick(tag.id)}
				/>
			</div>
		</form>
	);
};

export default TagInput;
