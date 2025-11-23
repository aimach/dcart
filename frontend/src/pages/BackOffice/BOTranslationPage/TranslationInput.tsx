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
import { updateTranslationFromKey } from "../../../utils/api/translationAPI";
import { notifyEditSuccess, notifyError } from "../../../utils/functions/toast";
// import des types
import type Quill from "quill";
import type { TranslationObjectType } from "../../../utils/types/languageTypes";
// import du style
import style from "./BOTranslationPage.module.scss";
// import des images
import homepageDescriptionImage from "../../../assets/homepage.description.png";
import homepageTitleImage from "../../../assets/homepage.title.png";
import mapIntro from "../../../assets/mapPage.introContent.png";
import menuDescription from "../../../assets/menu.description.png";

type TranslationInputProps = {
  translationObject: TranslationObjectType;
};

const getImageSrc = (key: string) => {
  switch (key) {
    case "homepage.atitle":
      return homepageTitleImage;
    case "homepage.description":
      return homepageDescriptionImage;
    case "menu.description":
      return menuDescription;
    case "mapPage.introContent":
      return mapIntro;
    default:
      return ""; // or a default image
  }
};

const TranslationInput = ({ translationObject }: TranslationInputProps) => {
  const { translation, language } = useTranslation();

  const quillRef = useRef<Quill | null>(null);

  const handleChange = async (data: TranslationObjectType) => {
    const responseStatus = await updateTranslationFromKey(
      data.id,
      data.key,
      data.fr,
      data.en
    );
    if (responseStatus === 200) {
      notifyEditSuccess("Traduction", true);
    } else {
      notifyError("Erreur lors de la mise à jour de la traduction");
    }
  };

  const isTitleKey = translationObject.key === "homepage.atitle";

  // import des sevice de formulaire
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TranslationObjectType>({
    defaultValues: translationObject ?? {},
  });

  return (
    <form onSubmit={handleSubmit(handleChange)}>
      <div className={style.translationManagementForm}>
        <div className={style.translationManagementRow}>
          <p>
            {
              (
                translation[language].backoffice
                  .translationManagement as Record<string, string>
              )[translationObject.key]
            }
          </p>
          <div className={style.translationInputRow}>
            <img
              src={getImageSrc(translationObject.key)}
              alt="indication du texte sur le site"
              width={200}
              height="auto"
              loading="lazy"
            />
            <div>
              <div className={style.translationInputContainer}>
                <LabelComponent
                  htmlFor="fr"
                  label={
                    translation[language].backoffice.translationManagement
                      .frenchTranslation
                  }
                  description=""
                />
                {isTitleKey ? (
                  <textarea
                    id="fr"
                    defaultValue={translationObject.fr}
                    {...register("fr", {
                      required: "Le champ français est requis",
                    })}
                    rows={5}
                  />
                ) : (
                  <Controller
                    name="fr"
                    control={control}
                    rules={{ required: "Le champ français est requis" }}
                    render={({ field: { onChange } }) => (
                      <EditorComponent
                        ref={quillRef}
                        onChange={onChange}
                        defaultValue={translationObject.fr || null}
                      />
                    )}
                  />
                )}
              </div>
              <div className={style.translationInputContainer}>
                <LabelComponent
                  htmlFor="en"
                  label={
                    translation[language].backoffice.translationManagement
                      .englishTranslation
                  }
                  description=""
                />
                {isTitleKey ? (
                  <textarea
                    id="en"
                    defaultValue={translationObject.en}
                    {...register("en", {
                      required: "Le champ anglais est requis",
                    })}
                    rows={5}
                  />
                ) : (
                  <Controller
                    name="en"
                    control={control}
                    rules={{ required: "Le champ anglais est requis" }}
                    render={({ field: { onChange } }) => (
                      <EditorComponent
                        ref={quillRef}
                        onChange={onChange}
                        defaultValue={translationObject.en || null}
                      />
                    )}
                  />
                )}
              </div>
            </div>
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
          type="submit"
          color="brown"
          textContent={translation[language].button.edit}
        />
      </div>
    </form>
  );
};

export default TranslationInput;
