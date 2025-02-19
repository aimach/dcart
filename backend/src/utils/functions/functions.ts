const getQueryStringForGodsFilter = (gods: string) => {
	const elementsTofilters = gods.split(",");
	const arrayElements = elementsTofilters.map((element) => `'%{${element}}%'`);
	return ` AND formule.formule NOT LIKE ALL(ARRAY[${arrayElements}]) `;
};

const getQueryStringForLocalisationFilter = (
	locationType: string,
	locationId: string,
) => {
	// on récupère le champ de la base de données correspondant à la granularité de la localisation
	let locationTypeField = "";
	switch (locationType) {
		case "subRegion":
			locationTypeField = "sous_region";
			break;
		case "greatRegion":
			locationTypeField = "grande_region";
			break;

		default:
			locationTypeField = "grande_region";
			break;
	}
	// on check le nombre d'ids
	if (locationId.includes("|")) {
		const locationIds = locationId.split("|").join(", ");
		return `AND ${locationTypeField}.id IN (${locationIds})`;
	}
	return `AND ${locationTypeField}.id = ${locationId}`;
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

const getQueryStringForDateFilter = (ante: string, post: string) => {
	return ` and datation.post_quem <= ${ante} and datation.ante_quem >= ${post} `;
};

const getQueryStringForIncludedElements = (
	includedElements: string,
	queryElements: string,
) => {
	const includedElementsArray = includedElements.split("|");
	const includedElementsArrayWithBrackets = includedElementsArray.map(
		(element) => `'%{${element}}%'`,
	);
	const queryElementsArray = queryElements.split("|");
	const queryElementsArrayWithBrackets = queryElementsArray.map(
		(element) => `'%{${element}}%'`,
	);
	const query = ` AND formule.formule LIKE ANY(ARRAY[${includedElementsArrayWithBrackets}]) `;
	if (queryElements) {
		return `${query} AND formule.formule LIKE ANY(ARRAY[${queryElementsArrayWithBrackets}]) `;
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
