// import des services
import { getAllDivinities } from "../api/builtMap/getRequests";
import { useMapFilterOptionsStore } from "../stores/builtMap/mapFilterOptionsStore";
// import des types
import type {
  Language,
  LanguageObject,
  TranslationType,
} from "../types/languageTypes";
import type {
  PointType,
  ElementType,
  MapFilterType,
  GreatRegionType,
  TimeMarkersType,
  DivinityType,
  MapInfoType,
} from "../types/mapTypes";
import type { MultiValue } from "react-select";
import type { OptionType } from "../types/commonTypes";
import type { UserFilterType } from "../types/filterTypes";

/**
 * Fonction qui vérifie si deux filtres sont déjà sélectionnés parmi les inputs
 * @param {MapFilterType} mapFilters - Les filtres de la carte en construction
 * @returns {boolean} - Un booléen
 */
const alreadyTwoFiltersChecked = (mapFilters: MapFilterType) => {
  let filtersChecked = 0;
  for (const filter in mapFilters) {
    if (mapFilters[filter as keyof MapFilterType]) {
      filtersChecked += 1;
    }
  }
  return filtersChecked >= 2;
};

/**
 * Fonction qui créé les options pour le select du filtre temporel
 * @param {TimeMarkersType} timeMarkers - Les bornes temporelles
 * @returns {string[]} - Un tableau avec la liste des options temporelles
 */
const createTimeOptions = (timeMarkers: TimeMarkersType) => {
  const options = [];
  for (let i = timeMarkers.post; i <= timeMarkers.ante; i += 100) {
    options.push({ value: i, label: i.toString() });
  }
  return options;
};

/**
 * Fonction qui formate les données pour le select de react-select (sortie {value, label})
 * @param {GreatRegionType[]} dataArray - Le tableau des données à formater
 * @param {string} language - La langue sélectionnée par l'utilisateur
 */
const formatDataForReactSelect = (
  dataArray: GreatRegionType[] | DivinityType[],
  language: string,
  isElements = false
) => {
  if (isElements) {
    return dataArray.map((data) => ({
      value: data.id,
      label: `${data[`nom_${language}` as keyof GreatRegionType]} (${
        (data as DivinityType).etat_absolu
      })`,
    }));
  }
  return dataArray.map((data) => ({
    value: data.id,
    label: data[`nom_${language}` as keyof GreatRegionType] as string,
  }));
};

/**
 * Fonction qui renvoie la liste des labels de datation en fonction des bornes et de l'écart donné
 * @param {number} minVal
 * @param {number} maxVal
 * @param {number} step
 * @returns {string[]} - Un tableau de labels
 */
const getAllDatationLabels = (
  minVal: number | string,
  maxVal: number | string,
  isDesktop: boolean
) => {
  const minValNumber =
    typeof minVal === "string" ? Number.parseInt(minVal, 10) : minVal;
  const maxValNumber =
    typeof maxVal === "string" ? Number.parseInt(maxVal, 10) : maxVal;

  const labelsArray = [];
  const stepLabel = isDesktop ? 100 : 200;
  for (let i = minValNumber; i <= maxValNumber; i += stepLabel) {
    if (!(i % 10)) {
      // si i finit par 0
      labelsArray.push(i.toString());
    }
  }
  return labelsArray;
};

/**
 * Fonction qui renvoie tous les éléments d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @returns {ElementType[]} - Le tableau des éléments
 */
const getAllElementsFromPoints = (points: PointType[]) => {
  const allElements: ElementType[] = [];
  points.map((point) => {
    point.sources.map((source) => {
      source.attestations.map((attestation) => {
        attestation.elements.map((element) => {
          if (!allElements.find((el) => el.element_id === element.element_id)) {
            allElements.push(element);
          }
        });
      });
    });
  });
  return allElements;
};

/**
 * Fonction qui renvoie tous les lieux d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @param {string} locationLevel - Le niveau de localisation (grande région, sous région ou nom ville)
 * @returns {Record<string, string>[]} - Le tableau des lieux
 */
const getAllLocationsFromPoints = (
  points: PointType[],
  locationLevel: string
) => {
  const allLocations: Record<string, string>[] = [];
  points.map((point) => {
    if (
      allLocations.find(
        (loc) => loc[locationLevel] === point[locationLevel as keyof PointType]
      )
    ) {
      return;
    }
    allLocations.push({
      grande_region_id: point.grande_region_id,
      grande_region_fr: point.grande_region_fr,
      grande_region_en: point.grande_region_en,
      sous_region_id: point.sous_region_id,
      sous_region_fr: point.sous_region_fr,
      sous_region_en: point.sous_region_en,
      nom_ville: point.nom_ville,
    });
  });
  return allLocations;
};

/**
 * Fonction qui renvoie le label du filtre en fonction de son type
 * @param {string} filterType - Le type du filtre
 * @param {TranslationType} translation - Les objets de traduction
 * @param {string} language - La langue sélectionnée par l'utilisateur
 * @returns {string} - Le label à afficher dans le formulaire
 */
const getFilterLabel = (
  filterType: string,
  translation: TranslationType,
  language: string
) => {
  switch (filterType) {
    case "location":
      return {
        label:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .locationFilter.label,
        description:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .locationFilter.description,
      };
    case "language":
      return {
        label: translation[language as keyof TranslationType].backoffice
          .mapFormPage.languageFilter.label as string,
        description: translation[language as keyof TranslationType].backoffice
          .mapFormPage.languageFilter.description as string,
      };
    case "element":
      return {
        label:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .epithetFilter.label,
        description:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .epithetFilter.description,
      };
    case "divinityNb":
      return {
        label:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .divinityNbFilter.label,
        description:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .divinityNbFilter.description,
      };
    case "sourceType":
      return {
        label:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .sourceTypeFilter.label,
        description:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .sourceTypeFilter.description,
      };
    case "agentActivity":
      return {
        label:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .agentActivityFilter.label,
        description:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .agentActivityFilter.description,
      };
    case "agentGender":
      return {
        label:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .agentGenderFilter.label,
        description:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .agentGenderFilter.description,
      };
    case "agentStatus":
      return {
        label:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .agentStatusFilter.label,
        description:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .agentStatusFilter.description,
      };
    case "agentivity":
      return {
        label:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .agentivityFilter.label,
        description:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .agentivityFilter.description,
      };
    case "sourceMaterial":
      return {
        label:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .sourceMaterialFilter.label,
        description:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .sourceMaterialFilter.description,
      };
    default:
      return {
        label:
          translation[language as keyof TranslationType].backoffice.mapFormPage
            .noFilter.label,
        description: "",
      };
  }
};

/**
 * Fonction qui renvoie les bornes temporelles d'une liste de points donnée
 * @param {PointType[]} allPoints - Les points
 * @returns {{ post: number, ante: number }} - Les bornes temporelles
 */
const getPointsTimeMarkers = (allPoints: PointType[]) => {
  const timeMarkers = { post: 400, ante: -1000 };
  for (const points of allPoints) {
    for (const source of points.sources) {
      if (source.ante_quem > timeMarkers.ante) {
        // on arrondit le chiffre pour avoir un multiple de 10 et mieux gérer l'échelle du filtre du temps
        timeMarkers.ante = Math.ceil(source.ante_quem / 10) * 10;
      }
      if (source.post_quem < timeMarkers.post) {
        // on arrondit le chiffre pour avoir un multiple de 10 et mieux gérer l'échelle du filtre du temps
        timeMarkers.post = Math.floor(source.post_quem / 10) * 10;
      }
    }
  }
  return timeMarkers;
};

/**
 * Fonction qui renvoie les valeurs par défaut des filtres, formatées pour le select
 * @param {MapFilterType} userFilters - Les filtres de l'utilisateur
 * @param {OptionType[]} listOptions - Les options du select
 * @returns {OptionType[]} - Les options du select filtrées et formatées
 */
const getSelectDefaultValues = (
  userFiltersListIdOrName: string,
  listOptions: OptionType[]
) => {
  if (!userFiltersListIdOrName) return [];
  let defaultValues: (string | number)[] = [];

  const firstElement = userFiltersListIdOrName.split("|")[0];
  // si ce sont des noms de localités ou d'éléments, on ne peut pas les convertir en nombre
  if (Number.isNaN(Number.parseInt(firstElement, 10))) {
    defaultValues = userFiltersListIdOrName.split("|");
    return (listOptions ?? []).filter((option) =>
      defaultValues.includes(option.value)
    );
  }

  // si ce sont des ids, on les convertit en nombre
  defaultValues = userFiltersListIdOrName
    .split("|")
    .map((idOrName) =>
      typeof idOrName === "string" ? Number.parseInt(idOrName, 10) : idOrName
    );
  return (listOptions ?? []).filter((option) =>
    defaultValues.includes(
      typeof option.value === "string"
        ? Number.parseInt(option.value, 10)
        : option.value
    )
  );
};

const handleMultiSelectChange = (
  key: string,
  selectedOptions: MultiValue<OptionType> | OptionType,
  setUserFilters: (filters: UserFilterType) => void,
  userFilters: UserFilterType,
  setAfterValue: (value: OptionType) => void,
  setBeforeValue: (value: OptionType) => void,
  setReminderValuesFunction: (names: string[]) => void
) => {
  if (key === "locationId" || key === "elementId") {
    const newValues = (selectedOptions as MultiValue<OptionType>)
      .map((option) => option.value)
      .join("|");

    setUserFilters({
      ...userFilters,
      [key]: newValues,
    });
    const newValuesLabel = (selectedOptions as MultiValue<OptionType>).map(
      (option) => option.label
    );
    setReminderValuesFunction(newValuesLabel);
  }
  if (key === "post") {
    setAfterValue(selectedOptions as OptionType);
    // on met à jour les userFilters au moment du submit pour éviter de modifier le filtre temporel (qui est visible)
  }
  if (key === "ante") {
    setBeforeValue(selectedOptions as OptionType);
    // on met à jour les userFilters au moment du submit pour éviter de modifier le filtre temporel (qui est visible)
  }
};

/**
 * Fonction qui gère les changements de select générés par l'utilisateur et stocke les valeurs dans le filtre des éléments
 * @param {MultiValue<OptionType>} selectedOptions - Les options sélectionnées
 * @param {string} key - La clé du filtre
 * @param {Function} setUserFilters - La fonction pour mettre à jour les filtres de l'utilisateur
 * @param {MapFilterType} userFilters - Les filtres de l'utilisateur
 * @returns {void} - Ne retourne rien
 */
const onMultiSelectChange = (
  selectedOptions: MultiValue<OptionType>,
  key: string,
  setUserFilters: (filters: UserFilterType) => void,
  userFilters: UserFilterType,
  setValuesFunction: (names: string[]) => void
) => {
  // stockage des valeurs dans le store pour les afficher dans le rappel de la carte
  const newValues = (selectedOptions as MultiValue<OptionType>).map(
    (option) => option.label
  );

  setValuesFunction(newValues);

  const elementValuesString = selectedOptions
    .map((option) => option.value)
    .join("|");

  setUserFilters({
    ...userFilters,
    [key]: elementValuesString,
  });
};

/**
 * Fonction qui vérifie si aucun filtre de la carte n'est sélectionné par l'utilisateur lors de la création ou modification
 * @param {MapFilterType} mapFilters - Les filtres de la carte en construction
 * @returns {boolean} - Un booléen
 */
const noFilterChecked = (mapFilters: MapFilterType) => {
  let filtersChecked = 0;
  for (const filter in mapFilters) {
    if (mapFilters[filter as keyof MapFilterType]) {
      filtersChecked += 1;
    }
  }
  return filtersChecked === 0;
};

/**
 * Fonction qui vérifie si aucun filtre n'est sélectionné par l'utilisateur
 * @param {UserFilterType} userFilters - Les filtres de la carte en construction
 * @returns {boolean} - Un booléen
 */
const noUserFilterChecked = (userFilters: UserFilterType) => {
  let filtersChecked = 0;
  for (const filter in userFilters) {
    if (
      (filter === "post" || filter === "ante") &&
      userFilters[filter as keyof UserFilterType]
    ) {
      filtersChecked += 1;
    }
  }
  return filtersChecked === 0;
};

/**
 * Fonction qui vérifie si aucun filtre n'est sélectionné par l'utilisateur
 * @param {UserFilterType} userFilters - Les filtres de la carte en construction
 * @param {string[]} locationFilterReminders - Les noms des localités sélectionnées
 * @param {string[]} elementFilterReminders - Les noms des éléments sélectionnés
 * @param {Record<string, boolean>} languageValues - Un objet contenant les booléens des langues sélectionnées
 * @param {string[]} agentStatusFilterReminders - Un objet contenant la liste des statuts sélectionnés
 * @param {string[]} agentivityFilterReminders - Un objet contenant la liste des agentivités sélectionnées
 * @param {string[]} sourceMaterialFilterReminders - Un objet contenant la liste des supports des sources sélectionnées
 * @param {string[]} languageFilterReminders - Un objet contenant la liste langues sélectionnées
 * @param {string[]} genderFilterReminders - Un objet contenant la liste des genres sélectionnés
 * @param {TranslationType} translationObject - Les objets de traduction
 * @returns {Array} - Un tableau de strings
 */
const displayFiltersTags = (
  userFilters: UserFilterType,
  locationFilterReminders: string[],
  elementFilterReminders: string[],
  elementNbFilterReminders: { min: number; max: number } | null,
  sourceTypeFilterReminders: string[],
  agentStatusFilterReminders: string[],
  agentivityFilterReminders: string[],
  agentActivityFilterReminders: string[],
  sourceMaterialFilterReminders: string[],
  languageFilterReminders: Record<string, boolean>,
  genderFilterReminders: Record<string, boolean>,
  translationObject: LanguageObject
) => {
  const stringArray = [];

  // affichage des dates
  if (userFilters.post !== -1000 || userFilters.ante !== 400) {
    if (userFilters.post !== undefined)
      stringArray.push(`${translationObject.common.after} ${userFilters.post}`);
    if (userFilters.ante !== undefined)
      stringArray.push(
        `${translationObject.common.before} ${userFilters.ante}`
      );
  }

  // affichage des langues
  if (languageFilterReminders.greek && languageFilterReminders.semitic) {
    stringArray.push(translationObject.mapPage.noGreekOrSemitic);
  } else if (languageFilterReminders.greek) {
    stringArray.push(translationObject.mapPage.noGreek);
  } else if (languageFilterReminders.semitic) {
    stringArray.push(translationObject.mapPage.noSemitic);
  }

  // affichage des lieux
  if (locationFilterReminders.length)
    stringArray.push(
      `${translationObject.common.in} ${locationFilterReminders.join(", ")}`
    );
  // affichage des éléments
  if (elementFilterReminders.length)
    stringArray.push(
      `${
        translationObject.mapPage.withElements
      } : ${elementFilterReminders.join(", ")}`
    );

  // affichage des types de source
  if (sourceTypeFilterReminders.length) {
    stringArray.push(
      `${translationObject.common.typeOf} : ${sourceTypeFilterReminders.join(
        ", "
      )}`
    );
  }

  // affichage des statuts
  if (agentStatusFilterReminders.length) {
    stringArray.push(
      `${
        translationObject.mapPage.withStatus
      } : ${agentStatusFilterReminders.join(", ")}`
    );
  }

  // affichage des agentivités
  if (agentivityFilterReminders.length) {
    stringArray.push(
      `${
        translationObject.mapPage.withAgentivities
      } : ${agentivityFilterReminders.join(", ")}`
    );
  }

  // affichage des supports de source
  if (sourceMaterialFilterReminders.length) {
    stringArray.push(
      `${
        translationObject.mapPage.withSourceMaterials
      } : ${sourceMaterialFilterReminders.join(", ")}`
    );
  }

  // affichage des activités des agents
  if (agentActivityFilterReminders.length) {
    stringArray.push(
      `${
        translationObject.mapPage.withAgentActivities
      } : ${agentActivityFilterReminders.join(", ")}`
    );
  }

  // affichage du genre des agents
  const isOneGenderKeyTrue = Object.values(genderFilterReminders ?? {}).some(
    (value) => value
  );
  if (isOneGenderKeyTrue) {
    stringArray.push(
      `${translationObject.mapPage.gender} : ${Object.entries(
        genderFilterReminders
      )
        .map(([key, value]) =>
          value
            ? `${translationObject.common.no} ${translationObject.mapPage.aside[key]}`
            : null
        )
        .filter(Boolean)
        .join(", ")}`
    );
  }

  if (elementNbFilterReminders) {
    stringArray.push(
      `${translationObject.mapPage.withElementsNb} : ${elementNbFilterReminders.min} ${translationObject.common.to} ${elementNbFilterReminders.max}`
    );
  }

  return stringArray;
};

/**
 * Fonction pour récupérer le nombre minimum et maximum d'éléments dans les points
 * @param {PointType[]} allPoints - Les points
 * @returns {min: number, max: number} - Un objet contenant le minimum et le maximum
 */
const getMinAndMaxElementNumbers = (
  mapInfos: MapInfoType | null,
  allPoints: PointType[]
) => {
  const filterOptionsStore = useMapFilterOptionsStore.getState();

  const elementNbFilter = isSelectedFilterInThisMap(mapInfos, "divinityNb");
  if (elementNbFilter) {
    let min = 20;
    let max = 0;
    for (const point of allPoints) {
      for (const sources of point.sources) {
        for (const attestations of sources.attestations) {
          if (attestations.elements.length > 0) {
            const uniqueElementsById = Object.values(
              attestations.elements.reduce((acc, element) => {
                acc[element.element_id] = element.element_id;
                return acc;
              }, {})
            );
            if (uniqueElementsById.length < min) {
              min = uniqueElementsById.length;
            }
            if (uniqueElementsById.length > max) {
              max = uniqueElementsById.length;
            }
          }
        }
      }
    }
    if (filterOptionsStore.hasFilteredPoints) {
      filterOptionsStore.setFilteredElementNbOptions({ min, max });
    } else {
      filterOptionsStore.setInitialElementNbOptions({ min, max });
    }
  }
};

/**
 * Fonction qui renvoie la liste des options d'éléments pour le select
 * @param {MapInfoType | null} mapInfos - Les informations de la carte
 * @param {PointType[]} allPoints - Les points
 * @param {Language} language - La langue sélectionnée par l'utilisateur
 * @param {boolean} isWithoutTheonym - Un booléen
 */
const getElementOptions = async (
  mapInfos: MapInfoType | null,
  allPoints: PointType[],
  language: Language,
  isWithoutTheonym: boolean,
  isForBackoffice = false
) => {
  const filterOptionsStore = useMapFilterOptionsStore.getState();

  // récupération des divinités de la BDD MAP
  const allDivinities = await getAllDivinities();

  let allElements: ElementType[] = [];

  if (mapInfos) {
    // extraction des éléments depuis les formules des points
    allElements = getAllElementsFromPoints(allPoints);
  } else {
    // récupération de tous les éléments dans la BDD
    allElements = allDivinities;
  }

  let filteredElements = allElements;

  if (isWithoutTheonym) {
    filteredElements = allElements.filter((element) => {
      return !allDivinities.some(
        (divinity: DivinityType) => divinity.id === element.element_id
      );
    });
  }

  // formattage des options pour le select
  const formatedElementOptions: OptionType[] = filteredElements
    .map((option) => {
      if (mapInfos) {
        return {
          value: option.element_id,
          label: `${option[`element_nom_${language}`]} (${option.etat_absolu})`,
          nom_fr: `${option.element_nom_fr} (${option.etat_absolu})`,
          nom_en: `${option.element_nom_en} (${option.etat_absolu})`,
        };
      }
      return {
        value: option.id,
        label: `${option[`nom_${language}`]} (${option.etat_absolu})`,
        nom_fr: `${option.nom_fr} (${option.etat_absolu})`,
        nom_en: `${option.nom_en} (${option.etat_absolu})`,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  if (isForBackoffice) {
    return formatedElementOptions;
  }

  if (filterOptionsStore.hasFilteredPoints) {
    // si des points sont filtrés, on compare avec les initiaux et on disabled ceux qui sont absents
    const initialElementOptions = filterOptionsStore.initialElementOptions;

    const elementOptionsWithDisabled = initialElementOptions.map((option) => {
      const isDisabled = !formatedElementOptions.some(
        (initialOption) =>
          initialOption.value === option.value &&
          initialOption.label === option.label
      );
      return {
        ...option,
        isDisabled,
      };
    });
    filterOptionsStore.setFilteredElementOptions(elementOptionsWithDisabled);
  } else {
    filterOptionsStore.setInitialElementOptions(formatedElementOptions);
  }
};

/**
 * Fonction qui renvoie tous les lieux d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @returns {Record<string, string>[]} - Le tableau des lieux
 */
const getAllSourceTypeFromPoints = (
  points: PointType[],
  language: Language
) => {
  const filterOptionsStore = useMapFilterOptionsStore.getState();
  const allSourceTypes: Record<string, string>[] = [];
  const sourceTypes = new Set<string>();

  points.map((point) => {
    point.sources.map((source) => {
      const typeSourceArray = source.types[`type_source_${language}`];
      const categorySourceArray = source.types[`category_source_${language}`];
      const typeAndCategorySourceArray = typeSourceArray.map((type, index) => {
        if (type && categorySourceArray[index]) {
          return `${categorySourceArray[index]} > ${type}`;
        }
        return type;
      });

      typeAndCategorySourceArray.map((typeAndCategorySource: string, index) => {
        if (sourceTypes.has(typeAndCategorySource)) {
          return;
        }
        if (typeAndCategorySource) {
          sourceTypes.add(typeAndCategorySource);
          allSourceTypes.push({
            type_fr: source.types.type_source_fr[index],
            type_en: source.types.type_source_en[index],
            label: typeAndCategorySource,
          });
        }
      });
    });
  });

  // formattage des options pour le select
  const sortedAllSourceTypes = allSourceTypes
    .map((option) => ({
      value: option.type_fr,
      label: option.label,
      isDisabled: filterOptionsStore.hasFilteredPoints,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  if (filterOptionsStore.hasFilteredPoints) {
    // si des points sont filtrés, on compare avec les initiaux et on disabled ceux qui sont absents
    const initialSourceTypeOptions =
      filterOptionsStore.initialSourceTypeOptions;

    const sourceTypeOptionsWithDisabled = initialSourceTypeOptions.map(
      (initialOption) => {
        const isDisabled = !sortedAllSourceTypes.some(
          (filteredOption) =>
            filteredOption.value === initialOption.value &&
            filteredOption.label === initialOption.label
        );
        return {
          ...initialOption,
          isDisabled,
        };
      }
    );
    filterOptionsStore.setFilteredSourceTypeOptions(
      sourceTypeOptionsWithDisabled
    );
  } else {
    filterOptionsStore.setInitialSourceTypeOptions(sortedAllSourceTypes);
  }
};

/**
 * Fonction qui renvoie toutes les activités des agents d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @param {Language} language - La langue sélectionnée par l'utilisateur
 * @returns {Record<string, string>[]} - Le tableau des options des activités
 */
const getAllAgentActivityFromPoints = (
  points: PointType[],
  language: Language
) => {
  const filterOptionsStore = useMapFilterOptionsStore.getState();
  const allAgentActivity: Record<string, string>[] = [];
  const activityIds = new Set<string>();

  for (const point of points) {
    for (const sources of point.sources) {
      for (const attestations of sources.attestations) {
        if (attestations.agents && attestations.agents.length > 0) {
          for (const agent of attestations.agents) {
            if (!agent.activite_id) continue;
            const id = agent.activite_id.toString();
            if (activityIds.has(id)) continue;
            if (agent.activite_fr && agent.activite_en) {
              activityIds.add(id);
              allAgentActivity.push({
                id,
                nom_fr: agent.activite_fr,
                nom_en: agent.activite_en,
              });
            }
          }
        }
      }
    }
  }

  // formattage des options pour le select
  const sortedAllAgentActivity = allAgentActivity
    .map((option) => ({
      value: option.id,
      label: option[`nom_${language}`],
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  if (filterOptionsStore.hasFilteredPoints) {
    // si des points sont filtrés, on compare avec les initiaux et on disabled ceux qui sont absents
    const initialAgentActivityOptions =
      filterOptionsStore.initialAgentActivityOptions;

    const agentActivityOptionsWithDisabled = initialAgentActivityOptions.map(
      (option) => {
        const isDisabled = !sortedAllAgentActivity.some(
          (initialOption) =>
            initialOption.value === option.value &&
            initialOption.label === option.label
        );
        return {
          ...option,
          isDisabled,
        };
      }
    );
    filterOptionsStore.setFilteredAgentActivityOptions(
      agentActivityOptionsWithDisabled
    );
  } else {
    filterOptionsStore.setInitialAgentActivityOptions(sortedAllAgentActivity);
  }
};

/**
 * Fonction qui renvoie toutes les noms des agents d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @param {Language} language - La langue sélectionnée par l'utilisateur
 * @returns {Record<string, string>[]} - Le tableau des options des noms
 */
const getAllAgentNameFromPoints = (points: PointType[], language: string) => {
  const allAgentFilterReminders: Record<string, string>[] = [];
  const names = new Set<string>();

  for (const point of points) {
    for (const sources of point.sources) {
      for (const attestations of sources.attestations) {
        if (attestations.agents && attestations.agents.length > 0) {
          for (const agent of attestations.agents) {
            if (!agent.designation) continue;
            const nameFr = agent.designation.split("<br/>")[0];
            const nameEn = agent.designation.split("<br/>")[1];
            if (names.has(nameFr)) continue;
            names.add(nameFr);
            allAgentFilterReminders.push({
              id: agent.designation,
              nom_fr: nameFr,
              nom_en: nameEn,
            });
          }
        }
      }
    }
  }
  // formattage des options pour le select
  return allAgentFilterReminders
    .map((name) => ({
      value: name.id,
      label: name[`nom_${language}`],
      isDisabled: useMapFilterOptionsStore.getState().hasFilteredPoints,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Fonction qui renvoie toutes les status des agents d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @param {Language} language - La langue sélectionnée par l'utilisateur
 * @returns {Record<string, string>[]} - Le tableau des options des statuts
 */
const getAllAgentStatusFromPoints = (points: PointType[], language: string) => {
  const filterOptionsStore = useMapFilterOptionsStore.getState();
  const allAgentStatus: Record<string, string>[] = [];
  const status = new Set<string>();

  for (const point of points) {
    for (const sources of point.sources) {
      for (const attestations of sources.attestations) {
        if (attestations.agents && attestations.agents.length > 0) {
          for (const agent of attestations.agents) {
            if (!agent.statut_fr) continue;
            const statutFr = agent.statut_fr;
            const statutEn = agent.statut_en;
            if (status.has(statutFr)) continue;
            status.add(statutFr);
            allAgentStatus.push({
              nom_fr: statutFr,
              nom_en: statutEn,
            });
          }
        }
      }
    }
  }
  // formattage des options pour le select
  const sortedAllAgentStatus = allAgentStatus
    .map((status) => ({
      value: status.nom_fr,
      label: status[`nom_${language}`],
      isDisabled: useMapFilterOptionsStore.getState().hasFilteredPoints,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  if (filterOptionsStore.hasFilteredPoints) {
    // si des points sont filtrés, on compare avec les initiaux et on disabled ceux qui sont absents
    const initialAgentStatusOptions =
      filterOptionsStore.initialAgentStatusOptions;

    const AgentStatusOptionsWithDisabled = initialAgentStatusOptions.map(
      (initialOption) => {
        const isDisabled = !sortedAllAgentStatus.some(
          (filteredOption) =>
            filteredOption.value === initialOption.value &&
            filteredOption.label === initialOption.label
        );
        return {
          ...initialOption,
          isDisabled,
        };
      }
    );
    filterOptionsStore.setFilteredAgentStatusOptions(
      AgentStatusOptionsWithDisabled
    );
  } else {
    filterOptionsStore.setInitialAgentStatusOptions(sortedAllAgentStatus);
  }
};

/**
 * Fonction qui renvoie toutes les agentivités d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @param {Language} language - La langue sélectionnée par l'utilisateur
 * @returns {Record<string, string>[]} - Le tableau des options des agentivités
 */
const getAllAgentivityFromPoints = (points: PointType[], language: string) => {
  const filterOptionsStore = useMapFilterOptionsStore.getState();
  const allAgentivity: Record<string, string>[] = [];
  const agentivities = new Set<string>();

  for (const point of points) {
    for (const sources of point.sources) {
      for (const attestations of sources.attestations) {
        if (attestations.agents && attestations.agents.length > 0) {
          for (const agent of attestations.agents) {
            if (!agent.agentivites) continue;
            for (const agentivity of agent.agentivites) {
              const agentivityFr = agentivity.nom_fr;
              const agentivityEn = agentivity.nom_en;
              if (agentivities.has(agentivityFr)) continue;
              agentivities.add(agentivityFr);
              allAgentivity.push({
                nom_fr: agentivityFr,
                nom_en: agentivityEn,
              });
            }
          }
        }
      }
    }
  }
  // formattage des options pour le select
  const sortedAllAgentivityOptions = allAgentivity
    .map((agentivity) => ({
      value: agentivity.nom_fr,
      label: agentivity[`nom_${language}`],
      isDisabled: useMapFilterOptionsStore.getState().hasFilteredPoints,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  if (filterOptionsStore.hasFilteredPoints) {
    // si des points sont filtrés, on compare avec les initiaux et on disabled ceux qui sont absents
    const initialAgentivityOptions =
      filterOptionsStore.initialAgentivityOptions;

    const AgentivityOptionsWithDisabled = initialAgentivityOptions.map(
      (initialOption) => {
        const isDisabled = !sortedAllAgentivityOptions.some(
          (filteredOption) =>
            filteredOption.value === initialOption.value &&
            filteredOption.label === initialOption.label
        );
        return {
          ...initialOption,
          isDisabled,
        };
      }
    );
    filterOptionsStore.setFilteredAgentivityOptions(
      AgentivityOptionsWithDisabled
    );
  } else {
    filterOptionsStore.setInitialAgentivityOptions(sortedAllAgentivityOptions);
  }
};

/**
 * Fonction qui renvoie tous les supports de source d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @param {Language} language - La langue sélectionnée par l'utilisateur
 * @returns {Record<string, string>[]} - Le tableau des options des supports de source
 */
const getAllSourceMaterialFromPoints = (
  points: PointType[],
  language: string
) => {
  const filterOptionsStore = useMapFilterOptionsStore.getState();
  const allSourceMaterial: Record<string, string>[] = [];
  const sourceMaterials = new Set<string>();

  for (const point of points) {
    for (const source of point.sources) {
      if (!source.types.material_fr) continue;

      const materialFr = source.types.material_fr;
      const materialEn = source.types.material_en;
      if (sourceMaterials.has(materialFr)) continue;
      sourceMaterials.add(materialFr);
      allSourceMaterial.push({
        nom_fr: materialFr,
        nom_en: materialEn,
        label: `${source.types[`material_category_${language}`]} > ${
          source.types[`material_${language}`]
        }`,
      });
    }
  }
  // formattage des options pour le select
  const sortedAllSourceMaterialOptions = allSourceMaterial
    .map((material) => ({
      value: material.nom_fr,
      label: material.label,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  if (filterOptionsStore.hasFilteredPoints) {
    // si des points sont filtrés, on compare avec les initiaux et on disabled ceux qui sont absents
    const initialSourceMaterialOptions =
      filterOptionsStore.initialSourceMaterialOptions;

    const sourceMaterialOptionsWithDisabled = initialSourceMaterialOptions.map(
      (initialOption) => {
        const isDisabled = !sortedAllSourceMaterialOptions.some(
          (filteredOption) =>
            filteredOption.value === initialOption.value &&
            filteredOption.label === initialOption.label
        );
        return {
          ...initialOption,
          isDisabled,
        };
      }
    );
    filterOptionsStore.setFilteredSourceMaterialOptions(
      sourceMaterialOptionsWithDisabled
    );
  } else {
    filterOptionsStore.setInitialSourceMaterialOptions(
      sortedAllSourceMaterialOptions
    );
  }
};

/**
 * Fonction qui renvoie toutes les genres des agents d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @param {Language} language - La langue sélectionnée par l'utilisateur
 * @returns {Record<string, string>[]} - Le tableau des options des genres
 */
const getAllAgentGenderFromPoints = (points: PointType[]) => {
  const filterOptionsStore = useMapFilterOptionsStore.getState();
  const allAgentGender: Record<string, string>[] = [];
  const gender = new Set<string>();

  for (const point of points) {
    for (const sources of point.sources) {
      for (const attestations of sources.attestations) {
        if (attestations.agents && attestations.agents.length > 0) {
          for (const agent of attestations.agents) {
            if (!agent.genres) continue;
            for (const genreObject of agent.genres) {
              const genreFr = genreObject.nom_fr;
              const genreEn = genreObject.nom_en;
              if (gender.has(genreFr)) continue;
              gender.add(genreFr);
              allAgentGender.push({
                nom_fr: genreFr,
                nom_en: genreEn,
              });
            }
          }
        }
      }
    }
  }
  // formattage des options pour le select
  const allAgentGenderOptions = allAgentGender.map((status) =>
    status.nom_en.toLowerCase()
  );
  if (filterOptionsStore.hasFilteredPoints) {
    // si des points sont filtrés, on compare avec les initiaux et on disabled ceux qui sont absents
    const initialAgentGenderOptions =
      filterOptionsStore.initialAgentGenderOptions;

    const agentGenderOptionsWithDisabled = initialAgentGenderOptions.filter(
      (initialOption) =>
        allAgentGenderOptions.some(
          (filteredOption) => filteredOption === initialOption
        )
    );
    filterOptionsStore.setFilteredAgentGenderOptions(
      agentGenderOptionsWithDisabled
    );
  } else {
    filterOptionsStore.setInitialAgentGenderOptions(allAgentGenderOptions);
  }
};

/**
 * Fonction qui renvoie le min et le max d'éléments d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @param {Language} language - La langue sélectionnée par l'utilisateur
 * @returns {Record<string, string>[]} - Le tableau des options des genres
 */
const getMinAndMaxElementNb = (points: PointType[]) => {
  let min = 0;
  let max = 0;

  for (const point of points) {
    for (const sources of point.sources) {
      for (const attestations of sources.attestations) {
        if (attestations.elements && attestations.elements.length > 0) {
          const elementsArrayLength = attestations.elements.length;
          if (elementsArrayLength < min) {
            min = elementsArrayLength;
          }
          if (elementsArrayLength > max) {
            max = elementsArrayLength;
          }
        }
      }
    }
  }
  return { min, max };
};

/**
 * Fonction qui renvoie un booléen pour savoir si le filtre est sélectionné dans la carte
 * @param mapInfos - les infos de la carte
 * @param filterName - le nom du filtre
 * @returns boolean
 */
const isSelectedFilterInThisMap = (
  mapInfos: MapInfoType | null,
  filterName: string
) => {
  return mapInfos?.filterMapContent?.find(
    (filter) => filter.filter.type === filterName
  );
};

/**
 * Fonction pour vérifier si un élément est dans une liste d'options
 * @param list - le tableau d'options
 * @param target - l'objet cible à vérifier
 * @returns boolean
 */
const isInList = (
  list: OptionType[],
  firstLevelTarget: OptionType,
  secondLevelTarget?: OptionType
) => {
  // s'il n'y a pas de second niveau, on vérifie juste le premier niveau
  const isFirstLevelInList = list.some(
    (item) => !item.isDisabled && item.value === firstLevelTarget.value
  );
  if (!secondLevelTarget) {
    return isFirstLevelInList;
  }
  // s'il y a un second niveau, on vérifie les deux niveaux
  const isSecondLevelInList = list.some(
    (item) => !item.isDisabled && item.value === secondLevelTarget.value
  );
  return isFirstLevelInList && isSecondLevelInList;
};

const resetAllFilterRemindersValues = (
  setLocationNameValues: (names: string[]) => void,
  setElementNameValues: (names: string[]) => void,
  setSourceTypeValues: (names: string[]) => void,
  setAgentActivityValues: (names: string[]) => void,
  setAgentStatusValues: (names: string[]) => void,
  setAgentivityValues: (names: string[]) => void,
  setSourceMaterialValues: (sourceMaterialName: string[]) => void,
  setElementNbValues: (values: { min: number; max: number } | null) => void,
  resetLanguageValues: () => void
) => {
  setLocationNameValues([]);
  setElementNameValues([]);
  setSourceTypeValues([]);
  setAgentActivityValues([]);
  setAgentStatusValues([]);
  setAgentivityValues([]);
  setSourceMaterialValues([]);
  setElementNbValues(null);
  resetLanguageValues();
};

export {
  alreadyTwoFiltersChecked,
  createTimeOptions,
  formatDataForReactSelect,
  getAllDatationLabels,
  getAllElementsFromPoints,
  getAllLocationsFromPoints,
  getFilterLabel,
  getPointsTimeMarkers,
  getSelectDefaultValues,
  handleMultiSelectChange,
  onMultiSelectChange,
  noFilterChecked,
  noUserFilterChecked,
  displayFiltersTags,
  getMinAndMaxElementNumbers,
  getElementOptions,
  getAllSourceTypeFromPoints,
  getAllAgentActivityFromPoints,
  getAllAgentNameFromPoints,
  isSelectedFilterInThisMap,
  getAllAgentStatusFromPoints,
  getAllAgentivityFromPoints,
  getAllSourceMaterialFromPoints,
  isInList,
  resetAllFilterRemindersValues,
  getAllAgentGenderFromPoints,
  getMinAndMaxElementNb,
};
