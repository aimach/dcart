/**
 * Les valeurs envoyées par le client ne sont jamais insérées dans le texte des requêtes :
 * chaque fonction qui reçoit des valeurs les ajoute au tableau `params` (paramètres SQL $1, $2...)
 * et renvoie un fragment de requête qui y fait référence.
 */

/**
 * Ajoute une valeur au tableau des paramètres SQL et renvoie son placeholder ($n)
 * @param {unknown[]} params - le tableau des paramètres SQL de la requête
 * @param {unknown} value - la valeur à ajouter
 * @returns {string} - le placeholder ($n)
 */
const addParam = (params: unknown[], value: unknown): string => {
	params.push(value);
	return `$${params.length}`;
};

/**
 * Transforme une liste d'ids (chaîne séparée par des "|" ou des "," ou tableau) en tableau d'entiers
 * Les valeurs qui ne sont pas des entiers sont ignorées
 * @param {unknown} value - la liste des ids
 * @returns {number[]} - le tableau des ids
 */
const parseIntegerList = (value: unknown): number[] => {
	const values = Array.isArray(value)
		? value
		: typeof value === "string" || typeof value === "number"
			? String(value).split(/[|,]/)
			: [];
	return values
		.map((item) => String(item).trim())
		.filter((item) => item !== "")
		.map(Number)
		.filter((id) => Number.isInteger(id));
};

/**
 * Transforme une liste de noms (chaîne séparée par des "|" ou tableau) en tableau de textes
 * @param {unknown} value - la liste des noms
 * @returns {string[]} - le tableau des noms
 */
const parseTextList = (value: unknown): string[] => {
	const values = Array.isArray(value)
		? value
		: typeof value === "string"
			? value.split("|")
			: [];
	return values.map((item) => String(item));
};

/**
 * Transforme une valeur en nombre fini, ou null si ce n'est pas possible
 * @param {unknown} value - la valeur à convertir
 * @returns {number | null} - le nombre ou null
 */
const parseNumber = (value: unknown): number | null => {
	if (value === undefined || value === null || value === "") {
		return null;
	}
	const number = Number(value);
	return Number.isFinite(number) ? number : null;
};

/**
 * Fonction qui renvoie la query string pour les filtres de date
 * Les valeurs non numériques sont ignorées
 * @param {unknown} ante - la date "avant"
 * @param {unknown} post - la date "après"
 * @param {unknown[]} params - le tableau des paramètres SQL de la requête
 * @returns {string} - la query string
 */
const getQueryStringForDateFilter = (
	ante: unknown,
	post: unknown,
	params: unknown[],
) => {
	const anteValue = parseNumber(ante);
	const postValue = parseNumber(post);
	let query = "";
	if (anteValue !== null) {
		query += ` and datation.post_quem <= ${addParam(params, anteValue)} `;
	}
	if (postValue !== null) {
		query += ` and datation.ante_quem >= ${addParam(params, postValue)} `;
	}
	return query;
};

/**
 * Renvoie les motifs LIKE ("%{id}%") correspondant à une liste d'ids d'éléments
 * @param {unknown} elements - la liste des ids des éléments (séparés par des "|")
 * @returns {string[]} - les motifs LIKE
 */
const getElementPatterns = (elements: unknown): string[] =>
	parseIntegerList(elements).map((id) => `%{${id}}%`);

/**
 * Fonction qui renvoie la query string pour filtrer les éléments exclus
 * @param {string} excludedElements - la liste des ids des éléments à exclure (séparés par des "|")
 * @param {unknown[]} params - le tableau des paramètres SQL de la requête
 * @returns {string} - la query string
 */
const getQueryStringForExcludedElements = (
	excludedElements: string,
	params: unknown[],
) => {
	const placeholder = addParam(params, getElementPatterns(excludedElements));
	return ` AND NOT (formule.formule LIKE ANY(${placeholder}::text[])) `;
};

/**
 * Fonction qui renvoie la query string pour filtrer les éléments inclus
 * @param {string} mapId - l'id de la carte (exploration ou un uuid)
 * @param {string} queryElements - la liste des ids des éléments à inclure (séparés par des "|")
 * @param {unknown[]} params - le tableau des paramètres SQL de la requête
 * @returns {string} - la query string
 */
const getQueryStringForIncludedElements = (
	mapId: string,
	queryElements: string,
	params: unknown[],
) => {
	let query = mapId === "exploration" ? "WHERE" : "AND";
	if (queryElements) {
		const placeholder = addParam(params, getElementPatterns(queryElements));
		query += ` formule.formule LIKE ANY(${placeholder}::text[]) `;
	}
	return query;
};

/**
 * Fonction qui renvoie la query string pour les filtres de langue
 * @param {string} language - la langue sélectionnée (greek, semitic)
 * @param {string} queryLanguage - la variable de langue dans la query (si jamais la fonction est utilisée plusieurs fois, pour aditionner les query strings)
 * @returns {string} - la query string
 */
const getQueryStringForLanguage = (language: string, queryLanguage: string) => {
	if (language === "greek") {
		return `${queryLanguage} AND SOURCE_LANGUE.id_SOURCE IN (SELECT id_source FROM source_langue WHERE id_langue != 25 GROUP BY id_source) `;
		// ici on rechercher dans les sources qui n'ont pas la langue grecque mais pourraient avoir d'autres langues (Araméen, Hébreu, etc.)
	}
	if (language === "semitic") {
		return `${queryLanguage} AND SOURCE_LANGUE.ID_LANGUE NOT IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 31, 32) `;
	}
	return "";
};

/**
 * Fonction qui renvoie la query string pour le filtre du nombre de puissances divines
 * Le filtre est ignoré si l'une des deux bornes n'est pas un nombre
 * @param {unknown} minDivinityNb - le nombre minimum de puissances divines
 * @param {unknown} maxDivinityNb - le nombre maximum de puissances divines
 * @param {unknown[]} params - le tableau des paramètres SQL de la requête
 * @returns {string} - la query string
 */
const getQueryStringForDivinityNb = (
	minDivinityNb: unknown,
	maxDivinityNb: unknown,
	params: unknown[],
) => {
	const min = parseNumber(minDivinityNb);
	const max = parseNumber(maxDivinityNb);
	if (min === null || max === null) {
		return "";
	}
	return `AND json_array_length(attestation_with_elements.elements) BETWEEN ${addParam(params, min)} AND ${addParam(params, max)}`;
};

/**
 * Fonction qui renvoie la query string pour le filtre du type de source
 * @param {string} sourceTypeName - la liste des noms des types de source (séparés par des "|")
 * @param {unknown[]} params - le tableau des paramètres SQL de la requête
 * @returns {string} - la query string
 */
const getQueryStringForSourceType = (
	sourceTypeName: string,
	params: unknown[],
) => {
	const placeholder = addParam(params, parseTextList(sourceTypeName));
	return `WHERE type_source.nom_fr = ANY(${placeholder}::text[])`;
};

/**
 * Fonction qui renvoie la query string pour les filtres du genre des agents
 * @param {Record<string, boolean>} agentGenderFilter - la liste des genres des agents à appliquer (séparés par des "|")
 * @returns {string} - la query string
 */
const getQueryStringForAgentGender = (
	agentGenderFilter: Record<string, boolean>,
) => {
	const queryArray = [];
	if (agentGenderFilter.male) {
		queryArray.push("'Masculin'");
	}
	if (agentGenderFilter.female) {
		queryArray.push("'Féminin'");
	}
	if (agentGenderFilter.nonBinary) {
		queryArray.push("'Non binaire'");
	}
	return queryArray.length > 0
		? ` AND genre.nom_fr NOT IN (${queryArray.join(", ")}) `
		: "";
};

/**
 * Fonction qui renvoie la query string pour les filtres du statut des agents
 * @param {string} agentStatusName - la liste des statuts des agents à appliquer (séparés par des "|")
 * @param {unknown[]} params - le tableau des paramètres SQL de la requête
 * @returns {string} - la query string
 */
const getQueryStringForAgentStatus = (
	agentStatusName: string,
	params: unknown[],
) => {
	const placeholder = addParam(params, parseTextList(agentStatusName));
	return `AND statut_affiche.nom_fr = ANY(${placeholder}::text[])`;
};

/**
 * Fonction qui renvoie la query string pour les filtres de l'agentivité
 * @param {string} agentivityName - la liste des agentivités à appliquer (séparés par des "|")
 * @param {unknown[]} params - le tableau des paramètres SQL de la requête
 * @returns {string} - la query string
 */
const getQueryStringForAgentivity = (
	agentivityName: string,
	params: unknown[],
) => {
	const placeholder = addParam(params, parseTextList(agentivityName));
	return `AND agentivite.nom_fr = ANY(${placeholder}::text[])`;
};

/**
 * Fonction qui renvoie la query string pour les filtres du support de sources
 * @param {string} sourceMaterialName - la liste des support à appliquer (séparés par des "|")
 * @param {string} querySourceType - la string de la query pour le type de source (mettre WHERE ou AND en fonction de la présence d'autres filtres)
 * @param {unknown[]} params - le tableau des paramètres SQL de la requête
 * @returns {string} - la query string
 */
const getQueryStringForSourceMaterial = (
	sourceMaterialName: string,
	querySourceType: string,
	params: unknown[],
) => {
	const placeholder = addParam(params, parseTextList(sourceMaterialName));
	const operator = querySourceType !== "" ? " AND " : "WHERE";
	return `${operator} type_support.nom_fr = ANY(${placeholder}::text[])`;
};

/**
 * Fonction qui renvoie la query string pour filtrer par localisation
 * - grande région / sous-région : tableau d'ids entiers (les valeurs non numériques sont ignorées)
 * - localité : tableau de noms de villes
 * @param {string} locationId - les ids (ou noms de villes) des localisations, séparés par des "|"
 * @param {string} locationLevel - le niveau de localisation (greatRegion, subRegion ou location)
 * @param {unknown[]} params - le tableau des paramètres SQL de la requête
 * @returns {string} - la query string
 */
const getQueryStringForLocalisationFilter = (
	locationId: string,
	locationLevel: string,
	params: unknown[],
) => {
	if (locationLevel === "location") {
		const placeholder = addParam(params, parseTextList(locationId));
		return ` AND localisation_source.nom_ville = ANY(${placeholder}::text[]) `;
	}

	const tableName =
		locationLevel === "subRegion" ? "sous_region" : "grande_region";
	const placeholder = addParam(params, parseIntegerList(locationId));
	return ` AND ${tableName}.id = ANY(${placeholder}::int[]) `;
};

/**
 * Fonction qui renvoie la query string pour filtrer par lieu (nom de la localité d'origine ou de découverte de la source)
 * @param {string} placeId - les noms des lieux, séparés par des "|"
 * @param {unknown[]} params - le tableau des paramètres SQL de la requête
 * @returns {string} - la query string
 */
const getQueryStringForPlaceFilter = (placeId: string, params: unknown[]) => {
	const placeholder = addParam(params, parseTextList(placeId));
	return ` AND localisation_source.nom_ville = ANY(${placeholder}::text[]) `;
};

export {
	addParam,
	parseIntegerList,
	getQueryStringForPlaceFilter,
	getQueryStringForDateFilter,
	getQueryStringForExcludedElements,
	getQueryStringForIncludedElements,
	getQueryStringForLanguage,
	getQueryStringForLocalisationFilter,
	getQueryStringForDivinityNb,
	getQueryStringForSourceType,
	getQueryStringForAgentGender,
	getQueryStringForAgentStatus,
	getQueryStringForAgentivity,
	getQueryStringForSourceMaterial,
};
