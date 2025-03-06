// import des types
import type { Language } from "../types/languageTypes";
import type {
	SourceType,
	PointType,
	AttestationType,
	ElementType,
} from "../types/mapTypes";

/**
 * Fonction qui renvoie la liste des activités (labels et quantités) des agents d'un point donné
 * @param {PointType} point
 * @param {Language} language
 * @returns {{ labels: string[], dataSets: number[]}} - Un tableau de labels et un tableau de données
 */
const getAgentActivityLabelsAndNb = (point: PointType, language: Language) => {
	// en premier lieu, on stocke tous les agents dans un tableau
	const allAgentsActivityOfPoint: {
		activite_en: string;
		activite_fr: string;
	}[] = [];
	point.sources.map((source: SourceType) => {
		source.attestations.map((attestation: AttestationType) => {
			// s'il y a un tableau agent
			if (attestation.agents) {
				for (const agent of attestation.agents) {
					// si les activités ne sont pas nulles
					if (agent.activite_en && agent.activite_fr) {
						allAgentsActivityOfPoint.push({
							activite_en: agent.activite_en,
							activite_fr: agent.activite_fr,
						});
					} else {
						allAgentsActivityOfPoint.push({
							activite_en: "Unknown",
							activite_fr: "Indéterminé",
						});
					}
				}
			} else {
				allAgentsActivityOfPoint.push({
					activite_en: "Unknown",
					activite_fr: "Indéterminé",
				});
			}
		});
	});

	// en second lieu, on stocke le label et le nombre d'occurence pour chaque genre
	const datasAndLabelsArray: Record<string, number>[] = [];
	const isInArray = (activity: { activite_en: string; activite_fr: string }) =>
		datasAndLabelsArray.find((data) => data[activity[`activite_${language}`]]);

	for (const activity of allAgentsActivityOfPoint) {
		if (!isInArray(activity)) {
			datasAndLabelsArray.push({ [activity[`activite_${language}`]]: 1 });
		} else {
			const activityFound = datasAndLabelsArray.find((obj) =>
				// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
				obj.hasOwnProperty(activity[`activite_${language}`]),
			);
			if (activityFound) {
				const key = activity[`activite_${language}`];
				activityFound[key] += 1;
			}
		}
	}
	const labels: string[] = datasAndLabelsArray.map(
		(data) => Object.keys(data)[0],
	);
	const dataSets: number[] = datasAndLabelsArray.map(
		(data) => Object.values(data)[0],
	);

	return { labels, dataSets };
};

/**
 * Fonction qui renvoie la liste des genres (labels et quantités) des agents d'un point donné
 * @param {PointType} point
 * @param {Language} language
 * @returns {{ labels: string[], dataSets: number[]}} - Un tableau de labels et un tableau de données
 */
const getAgentGenderLabelsAndNb = (point: PointType, language: Language) => {
	// en premier lieu, on stocke tous les agents dans un tableau
	const allAgentsGenderOfPoint: { nom_en: string; nom_fr: string }[] = [];
	point.sources.map((source: SourceType) => {
		source.attestations.map((attestation: AttestationType) => {
			// s'il y a un tableau agent
			if (attestation.agents) {
				for (const agent of attestation.agents) {
					// s'il le tableau des genres n'est pas vide
					if (agent.genres) {
						// si le tableau des genres contient plus d'un élément, on le remplace par un seul élément "mixed"
						if (agent.genres.length > 1) {
							allAgentsGenderOfPoint.push({
								nom_en: "Mixed",
								nom_fr: "Mixte",
							});
						} else {
							// sinon on ajoute l'agent tel quel
							allAgentsGenderOfPoint.push(agent.genres[0]);
						}
					} else {
						// si le tableau des genres est vide, on ajoute un élément "unknown"
						allAgentsGenderOfPoint.push({
							nom_en: "Unknown",
							nom_fr: "Indéterminé",
						});
					}
				}
			} else {
				allAgentsGenderOfPoint.push({
					nom_en: "Unknown",
					nom_fr: "Indéterminé",
				});
			}
		});
	});

	// en second lieu, on stocke le label et le nombre d'occurence pour chaque genre
	const datasAndLabelsArray: Record<string, number>[] = [];
	const isInArray = (gender: { nom_en: string; nom_fr: string }) =>
		datasAndLabelsArray.find((data) => data[gender[`nom_${language}`]]);

	for (const gender of allAgentsGenderOfPoint) {
		if (!isInArray(gender)) {
			datasAndLabelsArray.push({ [gender[`nom_${language}`]]: 1 });
		} else {
			const genderFound = datasAndLabelsArray.find((obj) =>
				// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
				obj.hasOwnProperty(gender[`nom_${language}`]),
			);
			if (genderFound) {
				const key = gender[`nom_${language}`];
				genderFound[key] += 1;
			}
		}
	}
	const labels: string[] = datasAndLabelsArray.map(
		(data) => Object.keys(data)[0],
	);
	const dataSets: number[] = datasAndLabelsArray.map(
		(data) => Object.values(data)[0],
	);

	return { labels, dataSets };
};

/**
 * Fonction qui renvoie la liste des épithètes (labels et quantités) d'un point donné en fonctionn de la divinité sélectionnée
 * @param {string} selectedDivinityId
 * @param {PointType} point
 * @param {Language} language
 * @returns {{ labels: string[], dataSets: number[]}} - Un tableau de labels et un tableau de données
 */
const getEpithetLabelsAndNb = (
	selectedDivinityId: string,
	point: PointType,
	language: Language,
) => {
	// en premier lieu, on stocke tous les éléments dans un tableau, excepté l'includedElement
	const allElementsOfPoint: ElementType[] = [];
	point.sources.map((source: SourceType) => {
		source.attestations.map((attestation: AttestationType) => {
			for (const element of attestation.elements) {
				if (element.element_id !== Number.parseInt(selectedDivinityId, 10)) {
					allElementsOfPoint.push(element);
				}
			}
		});
	});

	// en second lieu, on stocke le label et le nombre d'occurence pour chaque élément
	const datasAndLabelsArray: Record<string, number>[] = [];
	const isInArray = (element: ElementType) =>
		datasAndLabelsArray.find(
			(data) => data[element[`element_nom_${language}`]],
		);

	for (const element of allElementsOfPoint) {
		if (!isInArray(element)) {
			datasAndLabelsArray.push({ [element[`element_nom_${language}`]]: 1 });
		} else {
			const elementFound = datasAndLabelsArray.find((obj) =>
				// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
				obj.hasOwnProperty(element[`element_nom_${language}`]),
			);
			if (elementFound) {
				const key = element[`element_nom_${language}`] as string;
				elementFound[key] += 1;
			}
		}
	}

	// on trie le tableau par ordre décroissant
	const sortedDatasAndLabelsArray = [];
	for (const data of datasAndLabelsArray) {
		const key = Object.keys(data)[0];
		const value = Object.values(data)[0];
		sortedDatasAndLabelsArray.push([key, value]);
	}
	sortedDatasAndLabelsArray.sort((a, b) => (b[1] as number) - (a[1] as number));

	// on stocke les valeurs triées dans deux tableaux
	const labels: string[] = sortedDatasAndLabelsArray.map(
		(data) => data[0] as string,
	);
	const dataSets: number[] = sortedDatasAndLabelsArray.map(
		(data) => data[1] as number,
	);

	return { labels, dataSets };
};

export {
	getAgentActivityLabelsAndNb,
	getAgentGenderLabelsAndNb,
	getEpithetLabelsAndNb,
};
