// import des bibliothèques
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
// import des composants
import ButtonComponent from "../../../components/common/button/ButtonComponent";
import ErrorComponent from "../../../components/form/errorComponent/ErrorComponent";
import LabelComponent from "../../../components/form/inputComponent/LabelComponent";
import EditorComponent from "../../../components/form/storymapForm/wysiwygBlock/EditorComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { updateTag } from "../../../utils/api/builtMap/putRequests";
import { notifyEditSuccess, notifyError } from "../../../utils/functions/toast";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
// import des types
import type Quill from "quill";
import type { TagType } from "../../../utils/types/mapTypes";
// import du style
import style from "./tagManagementPage.module.scss";

type TagInputProps = {
  tag: TagType;
};

const TagInput = ({ tag }: TagInputProps) => {
  const { translation, language } = useTranslation();

  const { setReload, reload, openDeleteModal, setIdToDelete } = useModalStore();

  const quillRef = useRef<Quill | null>(null);

  // import des sevice de formulaire
  const {
    control,
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
            <Controller
              name="description_fr"
              control={control}
              render={({ field: { onChange } }) => (
                <EditorComponent
                  ref={quillRef}
                  onChange={onChange}
                  defaultValue={tag.description_fr || null}
                />
              )}
            />
          </div>
          <div className={style.tagInputContainer}>
            <LabelComponent
              htmlFor="description_en"
              label="Description en anglais :"
              description=""
            />
            <Controller
              name="description_en"
              control={control}
              render={({ field: { onChange } }) => (
                <EditorComponent
                  ref={quillRef}
                  onChange={onChange}
                  defaultValue={tag.description_en || null}
                />
              )}
            />
          </div>
        </div>
        {Object.keys(errors).length > 0 && (
          <ErrorComponent
            message={
              errors[Object.keys(errors)[0] as keyof typeof errors]?.message ||
              "Une erreur est survenue"
            }
          />
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
