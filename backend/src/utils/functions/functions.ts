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
	if (locationId.includes(",")) {
		return `AND ${locationTypeField}.id IN (${locationId})`;
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

const getQueryStringForDateFilter = (type: string, date: number) => {
	if (type === "ante") {
		return ` AND DATATION.ANTE_QUEM <= ${date} `;
	}
	if (type === "post") {
		return ` AND DATATION.POST_QUEM >= ${date} `;
	}
	return "";
};

const getQueryStringForIncludedElements = (includedElements: string) => {
	const includedElementsArray = includedElements.split(",");
	const includedElementsArrayWithBrackets = includedElementsArray.map(
		(element) => `'%{${element}}%'`,
	);
	return ` AND formule.formule LIKE ANY(ARRAY[${includedElementsArrayWithBrackets}]) `;
};

const getQueryStringForExcludedElements = (excludedElements: string) => {
	const excludedElementsArray = excludedElements.split(",");
	const excludedElementsArrayWithBrackets = excludedElementsArray.map(
		(element) => `'%{${element}}%'`,
	);
	return ` AND NOT (formule.formule LIKE ANY(ARRAY[${excludedElementsArrayWithBrackets}])) `;
};

export {
	getQueryStringForGodsFilter,
	getQueryStringForLocalisationFilter,
	getQueryStringForLanguageFilter,
	getQueryStringForDateFilter,
	getQueryStringForIncludedElements,
	getQueryStringForExcludedElements,
};
