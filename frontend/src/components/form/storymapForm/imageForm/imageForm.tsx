// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
// import des composants
import FormTitleComponent from "../common/FormTitleComponent";
import CommonForm from "../commonForm/CommonForm";
// import du context
// import des services
import { useShallow } from "zustand/shallow";
import { uploadImage } from "../../../../utils/api/mediaAPI";
import {
  createBlock,
  updateBlock,
} from "../../../../utils/api/storymap/postRequests";
import { imageInputs } from "../../../../utils/forms/storymapInputArray";
import { removeLang2Inputs } from "../../../../utils/functions/storymap";
import {
  notifyCreateSuccess,
  notifyEditSuccess,
} from "../../../../utils/functions/toast";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
// import des types
import type { SubmitHandler } from "react-hook-form";
import type { allInputsType } from "../../../../utils/types/formTypes";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";

export type imageInputsType = {
  content1_lang1: string | File | null | undefined;
  content1_lang2: string | File | null | undefined;
  content2_lang1: string;
  content2_lang2: string;
};

interface ImageFormProps {
  parentId?: string;
  defaultValues?: BlockContentType;
}

/**
 * Formulaire pour la création d'un bloc de type "image"
 */
const ImageForm = ({ parentId, defaultValues }: ImageFormProps) => {
  const { storymapInfos, updateFormType, block, reload, setReload } =
    useBuilderStore(useShallow((state) => state));

  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");

  const { storymapId } = useParams();

  // fonction appelée lors de la soumission du formulaire
  const onSubmit: SubmitHandler<imageInputsType> = async (data) => {
    // Gestion de l'upload d'image si présente
    const formData = { ...data };
    if (formData.content1_lang1 && formData.content1_lang1 instanceof File) {
      const uploaded = await uploadImage(formData.content1_lang1);
      if (uploaded) {
        // On remplace le fichier par l'URL renvoyée par le serveur
        formData.content1_lang1 = uploaded.original;
      } else {
        // En cas d'erreur d'upload, on arrête ou on gère l'erreur
        console.error("Échec de l'upload de l'image");
        return;
      }
    } else if (formData.content1_lang1 === "") {
      // Si le champ est une chaîne vide, cela signifie que l'utilisateur a supprimé l'image
      // On s'assure que la valeur envoyée au backend est bien vide pour déclencher la suppression
      formData.content1_lang1 = "";
    }
    // Si content1_lang1 est une string (URL) qui n'est pas vide et n'est pas un File, on la garde telle quelle

    // Conversion en string pour content1_lang1 et content1_lang2
    const imageUrl =
      typeof formData.content1_lang1 === "string"
        ? formData.content1_lang1
        : "";

    if (action === "create") {
      await createBlock({
        ...formData,
        content1_lang1: imageUrl,
        content1_lang2: imageUrl,
        parentId,
        storymapId: storymapId,
        typeName: "image",
      });
      notifyCreateSuccess("Bloc image", false);
    } else if (action === "edit") {
      await updateBlock(
        {
          ...formData,
          content1_lang1: imageUrl,
          content1_lang2: imageUrl,
          parentId,
          storymapId: storymapId,
          typeName: "image",
        },
        defaultValues ? defaultValues.id : (block?.id.toString() as string)
      );
      notifyEditSuccess("Bloc image", false);
    }
    setReload(!reload);
    updateFormType("blockChoice");
    setSearchParams(undefined);
  };

  const [inputs, setInputs] = useState(imageInputs);
  useEffect(() => {
    if (!storymapInfos?.lang2) {
      const newInputs = removeLang2Inputs(imageInputs);
      setInputs(newInputs);
    }
  }, [storymapInfos]);

  return (
    <>
      <FormTitleComponent action={action as string} translationKey="image" />
      <CommonForm
        key={block ? block.id : "image"}
        onSubmit={onSubmit as SubmitHandler<allInputsType>}
        inputs={inputs}
        defaultValues={(defaultValues ?? block) as BlockContentType}
        action={action as string}
      />
    </>
  );
};

export default ImageForm;
