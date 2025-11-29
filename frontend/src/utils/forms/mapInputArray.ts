// import des types
import type { InputType } from "../types/formTypes";

const firstStepInputs: InputType[] = [
  {
    label_fr: "Nom de la carte en français",
    label_en: "Map name in french",
    description_fr:
      "Le nom de la carte est affiché dans la liste des cartes et dans la modale d'introduction lorsque l'utilisateur ouvre la carte.",
    description_en:
      "The map name is displayed in the map list and in the introduction modal when the user opens the map.",
    name: "title_fr",
    type: "wysiwyg",
    required: {
      value: true,
      message: {
        fr: "Le titre en français est requis",
        en: "French title is required",
      },
    },
  },
  {
    label_fr: "Nom de la carte en anglais",
    label_en: "Map name in english",
    description_fr:
      "Le nom de la carte est affiché dans la liste des cartes et dans la modale d'introduction lorsque l'utilisateur ouvre la carte.",
    description_en:
      "The map name is displayed in the map list and in the introduction modal when the user opens the map.",
    name: "title_en",
    type: "wysiwyg",
    required: {
      value: true,
      message: {
        fr: "Le titre en anglais est requis",
        en: "English title is required",
      },
    },
  },
  {
    label_fr: "Description de la carte en français",
    label_en: "Map description in french",
    name: "description_fr",
    description_fr:
      "La description de la carte est affichée dans la modale d'introduction lorsque l'utilisateur ouvre la carte.",
    description_en:
      "The map description is displayed in the introduction modal when the user opens the map.",
    type: "wysiwyg",
    required: {
      value: true,
      message: {
        fr: "La description en français est requise",
        en: "French description is required",
      },
    },
  },
  {
    label_fr: "Description de la carte en anglais",
    label_en: "Map description in english",
    description_fr:
      "La description de la carte est affichée dans la modale d'introduction lorsque l'utilisateur ouvre la carte.",
    description_en:
      "The map description is displayed in the introduction modal when the user opens the map.",
    name: "description_en",
    type: "wysiwyg",
    required: {
      value: true,
      message: {
        fr: "La description en anglais est requise",
        en: "English description is required",
      },
    },
  },
  {
    label_fr: "Image accompagnant la description",
    label_en: "Image accompanying the description",
    description_fr:
      "L'image est affichée dans la modale d'introduction lorsque l'utilisateur ouvre la carte.",
    description_en:
      "The image is displayed in the introduction modal when the user opens the map.",
    name: "image_url",
    type: "file",
    required: {
      value: false,
    },
  },
];

export { firstStepInputs };
