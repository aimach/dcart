const getQueryStringForGodsFilter = (gods: string) => {
	const elementsTofilters = gods.split(",");
	const arrayElements = elementsTofilters.map((element) => `'%{${element}}%'`);
	return ` AND formule.formule NOT LIKE ALL(ARRAY[${arrayElements}]) `;
};

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

const getQueryStringForLanguageFilter = (languages: string) => {
	const languagesToFilter = languages ? (languages as string).split(",") : [];

	if (languagesToFilter.length) {
		for (const language of languagesToFilter) {
			if (language === "greek") {
				return " AND SOURCE_LANGUE.id_SOURCE IN (SELECT id_source FROM source_langue WHERE id_langue != 25 GROUP BY id_source) ";
				// ici on rechercher dans les sources qui n'ont pas la langue grecque mais pourraient avoir d'autres langues (Araméen, Hébreu, etc.)
			}
			if (language === "semitic") {
				return " AND SOURCE_LANGUE.ID_LANGUE NOT IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 31, 32) ";
			}
			return "";
		}
	} else {
		return "";
	}
};

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

const getQueryStringForExcludedElements = (excludedElements: string) => {
	const excludedElementsArray = excludedElements.split("|");
	const excludedElementsArrayWithBrackets = excludedElementsArray.map(
		(element) => `'%{${element}}%'`,
	);
	return ` AND NOT (formule.formule LIKE ANY(ARRAY[${excludedElementsArrayWithBrackets}])) `;
};

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

export {
	getQueryStringForGodsFilter,
	getQueryStringForLocalisationFilter,
	getQueryStringForLanguageFilter,
	getQueryStringForDateFilter,
	getQueryStringForIncludedElements,
	getQueryStringForExcludedElements,
	getQueryStringForLanguage,
};
