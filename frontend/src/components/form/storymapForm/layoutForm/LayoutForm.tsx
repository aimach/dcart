// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
// import des composants
import ButtonComponent from "../../../common/button/ButtonComponent";
import FormTitleComponent from "../common/FormTitleComponent";
import ImageForm from "../imageForm/imageForm";
import TextForm from "../textForm/TextForm";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useShallow } from "zustand/shallow";
import {
  createBlock,
  updateBlock,
} from "../../../../utils/api/storymap/postRequests";
import {
  notifyCreateSuccess,
  notifyEditSuccess,
} from "../../../../utils/functions/toast";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./layoutForm.module.scss";
// import des icônes
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Formulaire pour la création d'un bloc de type "layout"
 */
const LayoutForm = () => {
  const { translation, language } = useTranslation();

  const { block, reload, setReload, updateFormType } = useBuilderStore(
    useShallow((state) => state)
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");

  const { storymapId } = useParams();

  // déclération d'un état pour gérer les étapes du formulaire (layout, text, image)
  const [step, setStep] = useState(1);

  // déclaration d'un état pour stocker l'id du bloc layout parent
  const [layoutBlockId, setLayoutBlockId] = useState(
    block?.id.toString() || ""
  );

  // état pour gérer la position de l'image sélectionnée
  const [selectedPosition, setSelectedPosition] = useState<string>(
    block?.content1_lang1 || "left"
  );

  // état pour gérer la taille de l'image sélectionnée
  const [imageSize, setImageSize] = useState<string>(
    block?.content2_lang1 || "medium"
  );

  // définition de la fonction appelée lors du clic sur le choix de la disposition de l'image
  const handleClick = (position: string) => {
    setSelectedPosition(position);
  };

  // fonction pour passer à l'étape suivante après avoir créé/mis à jour le bloc layout
  const handleNextStep = async () => {
    if (!selectedPosition) {
      return; // Ne pas continuer si aucune position n'est sélectionnée
    }

    if (action === "create") {
      const response = await createBlock({
        content1_lang1: selectedPosition,
        content1_lang2: selectedPosition,
        content2_lang1: imageSize,
        content2_lang2: imageSize,
        storymapId: storymapId,
        typeName: "layout",
      });
      notifyCreateSuccess("Bloc de mise en page", false);
      setLayoutBlockId(response?.id.toString());
    } else if (action === "edit") {
      const response = await updateBlock(
        {
          ...block,
          children: [],
          content1_lang1: selectedPosition,
          content1_lang2: selectedPosition,
          content2_lang1: imageSize,
          content2_lang2: imageSize,
          storymapId: storymapId,
          typeName: "layout",
        },
        block?.id.toString() as string
      );
      notifyEditSuccess("Bloc de mise en page", false);
      setLayoutBlockId(response?.id.toString());
      setSearchParams({ action: "edit" });
    }
    setReload(!reload);
    // passage à l'étape suivante (formulaire texte)
    setStep(2);
  };

  // fonction pour mettre à jour la position et la taille de l'image
  const handleLayoutUpdate = async () => {
    if (action === "edit" && block && selectedPosition) {
      await updateBlock(
        {
          ...block,
          content1_lang1: selectedPosition,
          content1_lang2: selectedPosition,
          content2_lang1: imageSize,
          content2_lang2: imageSize,
          storymapId: storymapId,
          typeName: "layout",
        },
        block.id.toString()
      );
      notifyEditSuccess("Mise en page", false);
      setReload(!reload);
      setStep(2);
    }
  };

  // génération des valeurs par défaut pour les blocs enfants dans le cas d'une édition
  const [textDefaultValues, setTextDefaultValues] = useState<
    BlockContentType | undefined
  >(undefined);
  const [imageDefaultValues, setImageDefaultValues] = useState<
    BlockContentType | undefined
  >(undefined);
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (action === "edit") {
      setTextDefaultValues(
        block?.children.find(
          (child: BlockContentType) => child.type.name === "text"
        )
      );
      setImageDefaultValues(
        block?.children.find(
          (child: BlockContentType) => child.type.name === "image"
        )
      );
    }
  }, [action, block?.children]);

  // affichage du formulaire en fonction de l'étape
  switch (step) {
    case 1:
      return (
        <>
          <FormTitleComponent
            action={action as string}
            translationKey="layout"
          />
          <div className={style.formInputsContainer}>
            <div className={style.commonFormInputContainer}>
              <div className={style.labelContainer}>
                <label htmlFor="imagePosition">
                  {translation[language].backoffice.storymapFormPage.form
                    .imagePosition || "Position de l'image"}{" "}
                  <span style={{ color: "#9d2121" }}>*</span>
                </label>
                <p>
                  {translation[language].backoffice.storymapFormPage.form
                    .imagePositionDescription ||
                    "Choisissez si l'image doit être affichée à gauche ou à droite du texte"}
                </p>
              </div>
              <div className={style.inputContainer}>
                <select
                  id="imagePosition"
                  value={selectedPosition}
                  onChange={(e) => handleClick(e.target.value)}
                >
                  <option value="left">
                    {
                      translation[language].backoffice.storymapFormPage.form
                        .imageToLeft
                    }
                  </option>
                  <option value="right">
                    {
                      translation[language].backoffice.storymapFormPage.form
                        .imageToRight
                    }
                  </option>
                </select>
              </div>
            </div>
            <div className={style.commonFormInputContainer}>
              <div className={style.labelContainer}>
                <label htmlFor="imageSize">
                  {
                    translation[language].backoffice.storymapFormPage.form
                      .imageSize
                  }
                </label>
                <p>
                  {translation[language].backoffice.storymapFormPage.form
                    .imageSizeDescription ||
                    "Choisissez la taille d'affichage de l'image dans le layout. Une image 'petite' fera 20% de la largeur de la page, une image 'moyenne' fera 30% et une image 'grande' fera 50%."}
                </p>
              </div>
              <div className={style.inputContainer}>
                <select
                  id="imageSize"
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                >
                  <option value="large">
                    {
                      translation[language].backoffice.storymapFormPage.form
                        .imageSizeLarge
                    }
                  </option>
                  <option value="medium">
                    {
                      translation[language].backoffice.storymapFormPage.form
                        .imageSizeMedium
                    }
                  </option>
                  <option value="small">
                    {
                      translation[language].backoffice.storymapFormPage.form
                        .imageSizeSmall
                    }
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className={style.navigationButtonContainer}>
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
            {action === "create" && (
              <ButtonComponent
                type="button"
                color="brown"
                textContent={translation[language].common.next}
                onClickFunction={handleNextStep}
                icon={<ChevronRight />}
                isDisabled={!selectedPosition}
              />
            )}
            {action === "edit" && (
              <>
                <ButtonComponent
                  type="button"
                  color="brown"
                  textContent={translation[language].common.next}
                  onClickFunction={handleLayoutUpdate}
                  icon={<ChevronRight />}
                  isDisabled={!selectedPosition}
                />
                <ButtonComponent
                  type="button"
                  color="brown"
                  textContent={
                    translation[language].backoffice.storymapFormPage.form
                      .modifyTextNow
                  }
                  onClickFunction={() => {
                    setStep(2);
                  }}
                  icon={<ChevronRight />}
                />
                <ButtonComponent
                  type="button"
                  color="brown"
                  textContent={
                    translation[language].backoffice.storymapFormPage.form
                      .modifyImageNow
                  }
                  onClickFunction={() => {
                    setStep(3);
                  }}
                  icon={<ChevronRight />}
                />
              </>
            )}
          </div>
        </>
      );
    case 2:
      return (
        <TextForm
          parentId={layoutBlockId}
          setStep={setStep}
          defaultValues={textDefaultValues}
        />
      );
    case 3:
      return (
        <ImageForm
          parentId={layoutBlockId}
          defaultValues={imageDefaultValues}
        />
      );
    default:
      return null;
  }
};

export default LayoutForm;
