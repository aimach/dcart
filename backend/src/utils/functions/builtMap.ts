// import des types
import type { AttestationType, SourceType } from "../types/mapTypes";

/**
 * Fonction pour trier les sources par date (post quem puis ante quem)
 * @param {SourceType[]} sources - Les sources à trier
 * @returns {SourceType[]} - Les sources triées
 */
const sortSourcesByDate = (sources: SourceType[]) => {
	const sourcesWithDates = sources.filter(
		(source) => source.post_quem || source.ante_quem,
	);
	const sourcesWithoutDates = sources.filter(
		(source) => !source.post_quem && !source.ante_quem,
	);

	const sortedSourcesWithDates = sourcesWithDates.sort((a, b) => {
		if (a.post_quem === b.post_quem) {
			return a.ante_quem - b.ante_quem;
		}
		return a.post_quem - b.post_quem;
	});

	const sortedSourcesWithUnknownDate = [
		...sortedSourcesWithDates,
		...sourcesWithoutDates,
	];
	return sortedSourcesWithUnknownDate;
};

/**
 * Fonction utilisée pour vérifier si une attestation correspond à un lot d'ids (filtre élément)
 * @param attestation - L'attestation à vérifier
 * @param lotIdsArray - Le tableau d'ids
 * @returns boolean - true si l'attestation correspond au lot, false sinon
 */
const attestationMatchesLot = (
	attestation: AttestationType,
	lotIdsArray: number[][],
) => {
	const elementIds = attestation.elements?.map((e) => e.element_id) || [];

	return lotIdsArray.some((lot) => lot.every((id) => elementIds.includes(id)));
};

export { sortSourcesByDate, attestationMatchesLot };
