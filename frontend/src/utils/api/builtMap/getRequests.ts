// import des services
import { apiClient } from "../apiClient";
// import des types
import type { UserFilterType } from "../../types/filterTypes";
import type { OptionType } from "../../types/commonTypes";
import type { MultiValue } from "react-select";
import { all } from "axios";

/**
 * Récupère toutes les attestations d'une source à partir de son id
 * @param {string} sourceId - L'id de la source
 * @returns {Promise} - Toutes les attestations de la source
 */
const getAllAttestationsFromSourceId = async (
  sourceId: string,
  userFilters: UserFilterType
) => {
  try {
    const response = await apiClient.post(
      `/map/sources/${sourceId}/attestations`,
      JSON.stringify(userFilters)
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors du chargement des attestations de la source :",
      error
    );
  }
};

/**
 * Récupère tous les tags
 * @returns {Promise} - Une liste des ids des divinités
 */
const getDivinityIdsList = async () => {
  try {
    const response = await apiClient.get("/dcart/divinities/all");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors du chargement de la liste des divinités :",
      error
    );
  }
};

/**
 * Récupère la liste des étiquettes
 * @returns {Promise} - Toutes les catégories
 */
const getAllTags = async () => {
  try {
    const response = await apiClient.get("/dcart/tags/all");
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des tags :", error);
  }
};

/**
 * Récupère les catégories qui ont des cartes associées, avec les informations des cartes
 * @returns {Promise} - Toutes les catégories qui ont des cartes associées
 */
const getAllTagsWithMapsInfos = async () => {
  try {
    const response = await apiClient.get("/dcart/tags/all/maps");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors du chargement des tags avec les informations des cartes :",
      error
    );
  }
};

/**
 * Récupère toutes les divinités
 * @returns {Promise} - Toutes les divinités de la BDD MAP à partir de la liste définie dans le backoffice
 */
const getAllDivinities = async () => {
  try {
    const allDivinitiesFromDcart = await getDivinityIdsList();
    const response = await apiClient.post("/map/elements/divinities/all", {
      divinityIds: allDivinitiesFromDcart,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des divinités :", error);
  }
};

/**
 * Récupère toutes les grandes régions
 * @returns {Promise} - Toutes les grandes régions
 */
const getAllGreatRegions = async () => {
  try {
    const response = await apiClient.get("/map/locations/regions/all");
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des grandes régions :", error);
  }
};

/**
 * Récupère les informations de toutes les cartes qui sont actives
 * @returns {Promise} - Toutes les informations des cartes actives
 */
const getAllMapsInfos = async (
  isActive: boolean,
  searchText: string,
  myItems: boolean
) => {
  try {
    let url = "/dcart/maps/id/all";
    if (isActive || searchText || myItems) url += "?";
    const queryArray: string[] = [];
    if (isActive) queryArray.push("isActive=true");
    if (searchText) queryArray.push(`searchText=${searchText}`);
    if (myItems) queryArray.push("myItems=true");
    if (queryArray.length > 0) url += queryArray.join("&");

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des cartes :", error);
  }
};

/**
 * Récupère toutes les sources d'une carte à partir de son id
 * @param {string} id - L'id de la carte
 * @param {FormData | UserFilterType | null} params
 * @returns
 */
const getAllPointsByMapId = async (
  id: string,
  params: UserFilterType | null
) => {
  const body = params ?? {};
  try {
    const response = await apiClient.post(
      `/map/sources/map/${id}`,
      JSON.stringify(body)
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des sources :", error);
  }
};

/**
 * Récupère toutes les sources d'une carte à partir de l'id du block
 * @param {string} id - L'id du block
 * @returns
 */
const getAllPointsByBlockId = async (blockId: string, side?: string) => {
  try {
    const response = await apiClient.get(
      `/map/sources/block/${blockId}${side ? `?side=${side}` : ""}`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des sources :", error);
  }
};

/**
 * Récupère toutes les sources d'une carte à partir d'une liste d'ids d'attestations (pour la carte démo)
 * @param attestationIds - Les ids des attestations
 * @returns {Promise} - Toutes les sources de la carte
 */
const getAllPointsForDemoMap = async (attestationIds: string) => {
  try {
    const response = await apiClient("map/sources/attestations", {
      method: "POST",
      data: JSON.stringify({ attestationIds }),
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors du chargement des sources pour la démo :",
      error
    );
  }
};

/**
 * Récupère les informations de toutes les cartes qui sont actives
 * @returns {Promise} - Toutes les informations des cartes actives
 */
const getAllStorymapsInfos = async (
  isActive: boolean,
  searchText: string,
  myItems: boolean
) => {
  try {
    let url = "/storymap/storymap/id/all";
    if (isActive || searchText || myItems) url += "?";
    const queryArray: string[] = [];
    if (isActive) queryArray.push("isActive=true");
    if (searchText) queryArray.push(`searchText=${searchText}`);
    if (myItems) queryArray.push("myItems=true");
    if (queryArray.length > 0) url += queryArray.join("&");

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des cartes :", error);
  }
};

/**
 * Récupère toutes les informations d'une carte à partir de son id
 * @param {string} mapId - L'id de la carte
 * @returns {Promise | string} - Les informations de la carte ou une string "exploration"
 */
const getOneMapInfosById = async (mapId: string) => {
  try {
    if (mapId !== "exploration") {
      const response = await apiClient.get(`/dcart/maps/id/${mapId}`);
      const mapInfos = await response.data;
      return mapInfos;
    }
    return "exploration";
  } catch (error) {
    console.error(
      "Erreur lors du chargement des informations de la carte :",
      error
    );
  }
};

/**
 * Récupère toutes les informations d'une carte à partir de son slug
 * @param {string} mapSlug - Le slug de la carte
 * @returns {Promise | string} - Les informations de la carte ou une string "exploration"
 */
const getOneMapInfosBySlug = async (mapSlug: string) => {
  try {
    if (mapSlug !== "exploration") {
      const response = await apiClient.get(`/dcart/maps/slug/${mapSlug}`);
      const mapInfos = await response.data;
      return mapInfos;
    }
    return "exploration";
  } catch (error) {
    console.error(
      "Erreur lors du chargement des informations de la carte :",
      error
    );
    window.location.href = "/#/404";
  }
};

/**
 * Retourne les bornes temporelles de la base de données (tout point confondu)
 * @returns {Promise} - Les bornes temporelles de la base de données
 */
const getTimeMarkers = async () => {
  try {
    const response = await apiClient.get("/map/datation/timeMarkers");
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des bornes temporelles :", error);
  }
};

/**
 * Récupère la liste des filtres utilisateur qu'il est possible d'associer à une carte
 * @returns {Promise} - Les filtres utilisateur
 */
const getUserFilters = async () => {
  try {
    const response = await apiClient.get("/dcart/filters/all");
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des filtres utilisateur :", error);
  }
};

/**
 * Récupère la liste des icônes de la BDD
 * @returns {Promise} - Les icônes
 */
const getAllIcons = async () => {
  try {
    const response = await apiClient.get("/dcart/icons/all");
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des icônes :", error);
  }
};

/**
 * Récupère la liste des couleurs pour les icônes de la BDD
 * @returns {Promise} - Les couleurs
 */
const getAllColors = async () => {
  try {
    const response = await apiClient.get("/dcart/colors/all");
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des couleurs :", error);
  }
};

const getAllTagsWithMapsAndStorymaps = async (
  itemFilter: {
    map: boolean;
    storymap: boolean;
  },
  searchText: string,
  TagArray: MultiValue<OptionType>
) => {
  try {
    let filter = `?map=${itemFilter.map}&storymap=${itemFilter.storymap}`;
    if (searchText) {
      filter += `&searchText=${searchText}`;
    }
    if (TagArray.length > 0) {
      const tags = TagArray.map((tag) => tag.value).join(",");
      filter += `&tags=${tags}`;
    }
    const response = await apiClient.get(`/dcart/tags/items${filter}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des cartes et storyamps :", error);
  }
};

const getTagWithMapsAndStorymaps = async (
  tagSlug: string,
  itemFilter: { map: boolean; storymap: boolean }
) => {
  try {
    const filter = `?map=${itemFilter.map}&storymap=${itemFilter.storymap}`;
    const response = await apiClient.get(`/dcart/tags/${tagSlug}${filter}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des cartes et storyamps :", error);
    window.location.href = "/#/404";
  }
};

export {
  getAllAttestationsFromSourceId,
  getAllTags,
  getAllTagsWithMapsInfos,
  getAllDivinities,
  getAllGreatRegions,
  getAllMapsInfos,
  getAllPointsByMapId,
  getAllPointsForDemoMap,
  getAllStorymapsInfos,
  getOneMapInfosById,
  getOneMapInfosBySlug,
  getTimeMarkers,
  getUserFilters,
  getAllIcons,
  getAllColors,
  getAllPointsByBlockId,
  getAllTagsWithMapsAndStorymaps,
  getTagWithMapsAndStorymaps,
  getDivinityIdsList,
};
