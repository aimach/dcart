// import des types
import type { Repository } from "typeorm";
import type { AttestationType, SourceType } from "../types/mapTypes";
import type { MapContent } from "../../entities/builtMap/MapContent";
import type { Storymap } from "../../entities/storymap/Storymap";
import type { Tag } from "../../entities/common/Tag";
import type { Attestation } from "../../entities";

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

/**
 * Fonction utilisée pour "sluger" une chaîne de caractères
 * @param str - La chaîne de caractères à sluger
 * @returns string - La chaîne de caractères slugée
 */
const slugify = (str: string) =>
	str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // accents en caractères normaux
		.replace(/[^a-z0-9]+/g, "-") // caractères spéciaux en tirets
		.replace(/^-+|-+$/g, ""); // trim tirets

const generateUniqueSlug = async (
	str: string,
	repository: Repository<MapContent | Storymap | Tag>,
) => {
	const baseSlug = slugify(str);
	let slug = baseSlug;
	let suffix = 1;

	while (await repository.findOneBy({ slug })) {
		slug = `${baseSlug}-${suffix++}`;
	}

	return slug;
};

/**
 * Fonction pour déplacer un élément dans un tableau
 * @param array - Le tableau dans lequel déplacer l'élément
 * @param from - L'index de l'élément à déplacer
 * @param to  - L'index de la nouvelle position de l'élément
 * @returns {Array} - Le tableau mis à jour avec l'élément déplacé
 */
function arrayMove(
	array: Attestation[],
	from: number,
	to: number,
): Attestation[] {
	const updated = [...array];
	const [moved] = updated.splice(from, 1);
	updated.splice(to, 0, moved);
	return updated;
}

export {
	sortSourcesByDate,
	attestationMatchesLot,
	slugify,
	generateUniqueSlug,
	arrayMove,
};
