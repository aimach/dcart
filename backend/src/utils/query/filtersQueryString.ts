/**
 * Fonction qui convertit une valeur en entier, ou renvoie null si ce n'est pas un entier
 * @param {unknown} value - la valeur à convertir (nombre ou chaîne)
 * @returns {number | null} - l'entier, ou null
 */
const toInteger = (value: unknown): number | null => {
	if (typeof value === "number") {
		return Number.isInteger(value) ? value : null;
	}
	if (typeof value !== "string" || value.trim() === "") {
		return null;
	}
	const number = Number(value.trim());
	return Number.isInteger(number) ? number : null;
};

/**
 * Fonction qui convertit une liste d'ids séparés par des "|" en tableau d'entiers (les valeurs non numériques sont ignorées)
 * @param {string} ids - la liste des ids séparés par des "|"
 * @returns {number[]} - le tableau d'entiers
 */
const toIntegerArray = (ids: string): number[] =>
	ids
		.split("|")
		.map(toInteger)
		.filter((id): id is number => id !== null);

/**
 * Fonction qui renvoie la query string pour les filtres de date, et les valeurs à passer en paramètres SQL
 * Les dates ne sont pas insérées dans la requête : elles sont passées en paramètres SQL ($n), après validation en entiers
 * (une date qui n'est pas un entier est ignorée)
 * @param {string | null} ante - la date "avant"
 * @param {string | null} post - la date "après"
 * @param {number} paramIndex - l'index du premier paramètre SQL ($n) disponible
 * @returns {{ query: string, params: number[] }} - la query string et les valeurs des paramètres (dans l'ordre des $n)
 */
const getQueryStringForDateFilter = (
	ante: string | null,
	post: string | null,
	paramIndex: number,
): { query: string; params: number[] } => {
	const anteValue = toInteger(ante);
	const postValue = toInteger(post);
	let query = "";
	const params: number[] = [];
	if (anteValue !== null) {
		params.push(anteValue);
		query += ` and datation.post_quem <= $${paramIndex + params.length - 1}::int `;
	}
	if (postValue !== null) {
		params.push(postValue);
		query += ` and datation.ante_quem >= $${paramIndex + params.length - 1}::int `;
	}
	return { query, params };
};

/**
 * Fonction qui transforme une liste d'ids d'éléments en motifs LIKE ('%{id}%')
 * @param {string} elements - la liste des ids des éléments (séparés par des "|")
 * @returns {string[]} - les motifs LIKE (les ids non numériques sont ignorés)
 */
const getElementsLikePatterns = (elements: string): string[] =>
	toIntegerArray(elements).map((id) => `%{${id}}%`);

/**
 * Fonction qui renvoie la query string pour filtrer les éléments exclus, et la valeur à passer en paramètre SQL
 * Les motifs ne sont pas insérés dans la requête : ils sont passés en paramètre SQL (tableau de textes)
 * @param {string} excludedElements - la liste des ids des éléments à exclure (séparés par des "|")
 * @param {number} paramIndex - l'index du paramètre SQL ($n) qui contiendra le tableau des motifs
 * @returns {{ query: string, param: string[] }} - la query string et la valeur du paramètre
 */
const getQueryStringForExcludedElements = (
	excludedElements: string,
	paramIndex: number,
): { query: string; param: string[] } => {
	return {
		query: ` AND NOT (formule.formule LIKE ANY($${paramIndex}::text[])) `,
		param: getElementsLikePatterns(excludedElements),
	};
};

/**
 * Fonction qui renvoie la query string pour filtrer les éléments inclus, et la valeur à passer en paramètre SQL
 * Les motifs ne sont pas insérés dans la requête : ils sont passés en paramètre SQL (tableau de textes)
 * @param {string} mapId - l'id de la carte (exploration ou un uuid)
 * @param {string} queryElements - la liste des ids des éléments à inclure (séparés par des "|")
 * @param {number} paramIndex - l'index du paramètre SQL ($n) qui contiendra le tableau des motifs
 * @returns {{ query: string, param: string[] | null }} - la query string et la valeur du paramètre (null si aucun élément : rien à pousser dans les paramètres)
 */
const getQueryStringForIncludedElements = (
	mapId: string,
	queryElements: string,
	paramIndex: number,
): { query: string; param: string[] | null } => {
	let query = mapId === "exploration" ? "WHERE" : "AND";
	if (!queryElements) {
		return { query, param: null };
	}
	query += ` formule.formule LIKE ANY($${paramIndex}::text[]) `;
	return { query, param: getElementsLikePatterns(queryElements) };
};

/**
 * Fonction qui renvoie la query string pour filtrer par nombre de divinités, et les valeurs à passer en paramètres SQL
 * Les bornes sont validées en entiers et passées en paramètres SQL ($n)
 * @param {unknown} minDivinityNb - le nombre minimum de divinités
 * @param {unknown} maxDivinityNb - le nombre maximum de divinités
 * @param {number} paramIndex - l'index du premier paramètre SQL ($n) disponible
 * @returns {{ query: string, params: number[] }} - la query string et les valeurs des paramètres (vides si une borne n'est pas un entier)
 */
const getQueryStringForDivinityNb = (
	minDivinityNb: unknown,
	maxDivinityNb: unknown,
	paramIndex: number,
): { query: string; params: number[] } => {
	const min = toInteger(minDivinityNb);
	const max = toInteger(maxDivinityNb);
	if (min === null || max === null) {
		return { query: "", params: [] };
	}
	return {
		query: `AND json_array_length(attestation_with_elements.elements) BETWEEN $${paramIndex}::int AND $${paramIndex + 1}::int`,
		params: [min, max],
	};
};

/**
 * Fonction qui renvoie la query string pour les filtres du type de source, et la valeur à passer en paramètre SQL
 * Les noms ne sont pas insérés dans la requête : ils sont passés en paramètre SQL (tableau de textes)
 * @param {string} sourceTypeName - la liste des types de source à appliquer (séparés par des "|")
 * @param {number} paramIndex - l'index du paramètre SQL ($n) qui contiendra le tableau des noms
 * @returns {{ query: string, param: string[] }} - la query string et la valeur du paramètre
 */
const getQueryStringForSourceType = (
	sourceTypeName: string,
	paramIndex: number,
): { query: string; param: string[] } => {
	return {
		query: `WHERE type_source.nom_fr = ANY($${paramIndex}::text[])`,
		param: sourceTypeName.split("|"),
	};
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
 * Fonction qui renvoie la query string pour les filtres du statut des agents, et la valeur à passer en paramètre SQL
 * Les noms ne sont pas insérés dans la requête : ils sont passés en paramètre SQL (tableau de textes)
 * @param {string} agentStatusName - la liste des statuts des agents à appliquer (séparés par des "|")
 * @param {number} paramIndex - l'index du paramètre SQL ($n) qui contiendra le tableau des statuts
 * @returns {{ query: string, param: string[] }} - la query string et la valeur du paramètre
 */
const getQueryStringForAgentStatus = (
	agentStatusName: string,
	paramIndex: number,
): { query: string; param: string[] } => {
	return {
		query: `AND statut_affiche.nom_fr = ANY($${paramIndex}::text[])`,
		param: agentStatusName.split("|"),
	};
};

/**
 * Fonction qui renvoie la query string pour les filtres de l'agentivité, et la valeur à passer en paramètre SQL
 * Les noms ne sont pas insérés dans la requête : ils sont passés en paramètre SQL (tableau de textes)
 * @param {string} agentivityName - la liste des agentivités à appliquer (séparés par des "|")
 * @param {number} paramIndex - l'index du paramètre SQL ($n) qui contiendra le tableau des agentivités
 * @returns {{ query: string, param: string[] }} - la query string et la valeur du paramètre
 */
const getQueryStringForAgentivity = (
	agentivityName: string,
	paramIndex: number,
): { query: string; param: string[] } => {
	return {
		query: `AND agentivite.nom_fr = ANY($${paramIndex}::text[])`,
		param: agentivityName.split("|"),
	};
};

/**
 * Fonction qui renvoie la query string pour les filtres du support de sources, et la valeur à passer en paramètre SQL
 * Les noms ne sont pas insérés dans la requête : ils sont passés en paramètre SQL (tableau de textes)
 * @param {string} sourceMaterialName - la liste des support à appliquer (séparés par des "|")
 * @param {string} querySourceType - la string de la query pour le type de source (mettre WHERE ou AND en fonction de la présence d'autres filtres)
 * @param {number} paramIndex - l'index du paramètre SQL ($n) qui contiendra le tableau des supports
 * @returns {{ query: string, param: string[] }} - la query string et la valeur du paramètre
 */
const getQueryStringForSourceMaterial = (
	sourceMaterialName: string,
	querySourceType: string,
	paramIndex: number,
): { query: string; param: string[] } => {
	let operator = "WHERE";
	if (querySourceType !== "") {
		operator = " AND ";
	}
	return {
		query: `${operator} type_support.nom_fr = ANY($${paramIndex}::text[])`,
		param: sourceMaterialName.split("|"),
	};
};

/**
 * Fonction qui renvoie la query string pour filtrer par localisation, et la valeur à passer en paramètre SQL
 * Les valeurs ne sont pas insérées dans la requête : elles sont passées en paramètre SQL ($n)
 * - grande région / sous-région : tableau d'ids entiers (les valeurs non numériques sont ignorées)
 * - localité : tableau de noms de villes
 * @param {string} locationId - les ids (ou noms de villes) des localisations, séparés par des "|"
 * @param {string} locationLevel - le niveau de localisation (greatRegion, subRegion ou location)
 * @param {number} paramIndex - l'index du paramètre SQL ($n) qui contiendra le tableau des valeurs
 * @returns {{ query: string, param: number[] | string[] }} - la query string et la valeur du paramètre
 */
const getQueryStringForLocalisationFilter = (
	locationId: string,
	locationLevel: string,
	paramIndex: number,
): { query: string; param: number[] | string[] } => {
	const values = locationId.split("|");

	if (locationLevel === "location") {
		return {
			query: ` AND localisation_source.nom_ville = ANY($${paramIndex}::text[]) `,
			param: values,
		};
	}

	const tableName =
		locationLevel === "subRegion" ? "sous_region" : "grande_region";
	const ids = values
		.map((value) => value.trim())
		.filter((value) => value !== "")
		.map(Number)
		.filter((id) => Number.isInteger(id));
	return {
		query: ` AND ${tableName}.id = ANY($${paramIndex}::int[]) `,
		param: ids,
	};
};

/**
 * Fonction qui renvoie la query string pour filtrer par lieu (nom de la localité d'origine ou de découverte de la source)
 * Les noms ne sont pas insérés dans la requête : ils sont passés en paramètre SQL (tableau de textes)
 * @param {number} paramIndex - l'index du paramètre SQL ($n) qui contient le tableau des noms de lieux
 * @returns {string} - la query string
 */
const getQueryStringForPlaceFilter = (paramIndex: number) => {
	return ` AND localisation_source.nom_ville = ANY($${paramIndex}::text[]) `;
};

export {
	getQueryStringForPlaceFilter,
	getQueryStringForDateFilter,
	getQueryStringForExcludedElements,
	getQueryStringForIncludedElements,
	getQueryStringForLanguage,
	getQueryStringForLocalisationFilter,
	getQueryStringForAgentGender,
	getQueryStringForAgentStatus,
	getQueryStringForAgentivity,
	getQueryStringForSourceMaterial,
	getQueryStringForDivinityNb,
	getQueryStringForSourceType,
};
