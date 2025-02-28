/**
 * Fonction qui renvoie la query string pour les filtres de date
 * @param {string | null} ante - la date "avant"
 * @param {string | null} post - la date "après"
 * @returns {string} - la query string
 */
const getQueryStringForDateFilter = (
	ante: string | null,
	post: string | null,
) => {
	if (!ante && !post) {
		return "";
	}
	if (!ante) {
		return ` and datation.ante_quem >= ${post} `;
	}
	if (!post) {
		return ` and datation.post_quem <= ${ante} `;
	}
	return ` and datation.post_quem <= ${ante} and datation.ante_quem >= ${post} `;
};

/**
 * Fonction qui renvoie la query string pour filtrer les éléments exclus
 * @param {string} excludedElements - la liste des ids des éléments à exclure (séparés par des "|")
 * @returns {string} - la query string
 */
const getQueryStringForExcludedElements = (excludedElements: string) => {
	const excludedElementsArray = excludedElements.split("|");
	const excludedElementsArrayWithBrackets = excludedElementsArray.map(
		(element) => `'%{${element}}%'`,
	);
	return ` AND NOT (formule.formule LIKE ANY(ARRAY[${excludedElementsArrayWithBrackets}])) `;
};

/**
 * Fonction qui renvoie la query string pour filtrer les éléments inclus
 * @param {string} mapId - l'id de la carte (exploration ou un uuid)
 * @param {string} queryElements - la liste des ids des éléments à inclure (séparés par des "|")
 * @returns {string} - la query string
 */
const getQueryStringForIncludedElements = (
	mapId: string,
	queryElements: string,
) => {
	const queryElementsArray = queryElements.split("|");
	const queryElementsArrayWithBrackets = queryElementsArray.map(
		(element) => `'%{${element}}%'`,
	);
	let query = mapId === "exploration" ? "WHERE" : "AND";
	if (queryElements) {
		query += ` formule.formule LIKE ANY(ARRAY[${queryElementsArrayWithBrackets}]) `;
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
 * Fonction qui renvoie la query string pour filtrer par localisation
 * @param {string} mapId - l'id de la carte (exploration ou un uuid)
 * @param {string} locationId - l'id de la localisation
 * @returns {string} - la query string
 */
const getQueryStringForLocalisationFilter = (
	mapId: string,
	locationId: string,
) => {
	const tableName = mapId === "exploration" ? "grande_region" : "sous_region";
	// on check le nombre d'ids
	if (locationId.includes("|")) {
		const locationIds = locationId.split("|").join(", ");
		return `AND ${tableName}.id IN (${locationIds})`;
	}
	return `AND ${tableName}.id = ${locationId}`;
};

export {
	getQueryStringForDateFilter,
	getQueryStringForExcludedElements,
	getQueryStringForIncludedElements,
	getQueryStringForLanguage,
	getQueryStringForLocalisationFilter,
};
