const getQueryStringForGodsFilter = (gods: string) => {
	const elementsTofilters = gods.split(",");
	const arrayElements = elementsTofilters.map((element) => `'%{${element}}%'`);
	return ` AND formule.formule NOT LIKE ALL(ARRAY[${arrayElements}]) `;
};

const getQueryStringForLocalisationFilter = (
	locationType: string,
	locationId: number,
) => {
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
	return `WHERE ${locationTypeField}.id = ${locationId}`;
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

export {
	getQueryStringForGodsFilter,
	getQueryStringForLocalisationFilter,
	getQueryStringForLanguageFilter,
	getQueryStringForDateFilter,
};
