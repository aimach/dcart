// import des entités
import { MapContent } from "../../../entities/builtMap/MapContent";
// import des services
import { dcartDataSource, mapDataSource } from "../../../dataSource/dataSource";
import {
	getAttestationsBySourceId,
	getSourcesQueryWithDetails,
	getSourcesQueryWithoutDetails,
} from "../../../utils/query/sourceQueryString";
import {
	getQueryStringForLocalisationFilter,
	getQueryStringForDateFilter,
	getQueryStringForIncludedElements,
	getQueryStringForLanguage,
} from "../../../utils/query/filtersQueryString";
import { sortSourcesByDate } from "../../../utils/functions/builtMap";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import { query, type Request, type Response } from "express";
import type { AttestationType, ElementType, PointType, SourceType } from "../../../utils/types/mapTypes";
import type { Attestation } from "../../../entities/builtMap/Attestation";
import { match } from "assert";

export const sourceController = {
	// récupérer toutes les sources à partir de l'id de la carte
	getSourcesByMapId: async (req: Request, res: Response): Promise<void> => {
		try {
			// on récupère params et query
			const { mapId } = req.params;

			// on prépare la variable à renvoyer
			let results = null;

			if (mapId === "exploration") {
				// on prépare les query des filtres
				let queryLocalisation = "";
				const maxValue = null;
				const minValue = null;
				let queryDatation = getQueryStringForDateFilter(maxValue, minValue);
				let queryIncludedElements = "";

				if (req.query.locationId) {
					// s'il existe des params, on remplace les valeurs par celles des params
					queryLocalisation = req.query.locationId
						? getQueryStringForLocalisationFilter(
							mapId,
							req.query.locationId as string,
						)
						: queryLocalisation;
				}

				if (req.query.ante || req.query.post) {
					const maxValue = req.query.ante ? req.query.ante.toString() : null;
					const minValue = req.query.post ? req.query.post.toString() : null;
					queryDatation = getQueryStringForDateFilter(maxValue, minValue);
				}

				if (req.query.elementId) {
					// ici se fait la récupération des épithètes
					queryIncludedElements = getQueryStringForIncludedElements(
						mapId,
						req.query.elementId as string,
					);
				}

				let queryLanguage = "";
				if (req.query.greek === "true") {
					queryLanguage = getQueryStringForLanguage("greek", queryLanguage);
				}
				if (req.query.semitic === "true") {
					queryLanguage = getQueryStringForLanguage("semitic", queryLanguage);
				}

				// on récupère le texte de la requête SQL
				const sqlQuery = getSourcesQueryWithoutDetails(
					queryLocalisation,
					queryDatation,
					queryIncludedElements,
					queryLanguage,
				);
				results = await mapDataSource.query(sqlQuery);
			} else {
				// on récupère les informations de la carte
				const mapInfos = await dcartDataSource
					.getRepository(MapContent)
					.createQueryBuilder("map")
					.leftJoinAndSelect("map.attestations", "attestations")
					.leftJoinAndSelect("attestations.icon", "icon")
					.where("map.id = :id", { id: mapId })
					.getOne();
				if (!mapInfos) {
					res.status(404).send({ Erreur: "Carte non trouvée" });
				}

				// on prépare les query des filtres
				let queryLocalisation = "";
				const maxDateValue = null;
				const minDateValue = null;
				let queryDatation = getQueryStringForDateFilter(
					maxDateValue,
					minDateValue,
				);
				let queryIncludedElements = "";
				let queryDivinityNb = "";
				let queryLotIds = "";

				// s'il existe des params, on remplace les valeurs par celles des params
				if (req.query.locationId) {
					queryLocalisation = req.query.locationId
						? getQueryStringForLocalisationFilter(
							mapId,
							req.query.locationId as string,
						)
						: queryLocalisation;
				}

				if (req.query.ante || req.query.post) {
					const maxDateValue = req.query.ante
						? req.query.ante.toString()
						: null;
					const minDateValue = req.query.post
						? req.query.post.toString()
						: null;
					queryDatation = getQueryStringForDateFilter(
						maxDateValue,
						minDateValue,
					);
				}

				// ici se fait la récupération des épithètes
				if (req.query.elementId) {
					queryIncludedElements = getQueryStringForIncludedElements(
						mapId,
						req.query.elementId as string,
					);
				}

				let queryLanguage = "";
				if (req.query.greek === "true") {
					queryLanguage = getQueryStringForLanguage("greek", queryLanguage);
				}
				if (req.query.semitic === "true") {
					queryLanguage = getQueryStringForLanguage("semitic", queryLanguage);
				}

				if (req.query.minDivinityNb && req.query.maxDivinityNb) {
					queryDivinityNb = `AND json_array_length(attestation_with_elements.elements) BETWEEN ${req.query.minDivinityNb} AND ${req.query.maxDivinityNb}`;
				}

				const { attestations } = mapInfos as MapContent;
				results = await Promise.all(
					attestations.map(async (attestation: Attestation) => {
						const sqlQuery = getSourcesQueryWithDetails(
							attestation.attestationIds,
							queryLocalisation,
							queryDatation,
							queryLanguage,
							queryIncludedElements,
							queryDivinityNb,
							queryLotIds
						);

						const queryResults = await mapDataSource.query(sqlQuery);


						// on trie les sources si req.query.lotIds est présent
						let filteredResults = [];
						if (req.query.lotIds) {
							const lotIdsArray = (req.query.lotIds as string).split("|").map((lot) => JSON.parse(lot));
							const attestationMatchesLot = (attestation: AttestationType, lotIdsArray: number[][]) => {
								const elementIds = attestation.elements?.map(e => e.element_id) || [];
								return lotIdsArray.some(lot =>
									lot.every(id => elementIds.includes(id))
								);
							};

							const filterPointsByValidLots = (points: PointType[], lotIdsArray: number[][]) => {
								return points
									.map(point => {
										const filteredSources = point.sources
											?.map(source => {
												const filteredAttestations = source.attestations
													?.filter(attestation => attestationMatchesLot(attestation, lotIdsArray));

												if (filteredAttestations && filteredAttestations.length > 0) {
													return { ...source, attestations: filteredAttestations };
												}
												return null;
											})
											.filter(source => source !== null);

										if (filteredSources && filteredSources.length > 0) {
											return { ...point, sources: filteredSources };
										}
										return null;
									})
									.filter(point => point !== null);
							};

							filteredResults = filterPointsByValidLots(queryResults, lotIdsArray);

						} else {
							filteredResults = queryResults;
						}

						// on trie les sources de chaque point par date
						const sortedResults = filteredResults.map((point: PointType) => {
							return {
								...point,
								sources: sortSourcesByDate(point.sources),
								color: attestation.color,
								shape: attestation.icon?.name,
								layerName: attestation.name,
							};
						});
						return sortedResults;
					}),
				);
			}

			res.status(200).json(results.flat());
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// récupérer toutes les sources par la liste des attestations
	getSourcesByAttestationIds: async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			// on récupère la liste des attestations
			const { attestationIds } = req.body;

			// on récupère le texte de la requête SQL
			const sqlQuery = getSourcesQueryWithDetails(
				attestationIds,
				"",
				"",
				"",
				"",
				"",
				""
			);

			const results = await mapDataSource.query(sqlQuery);

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// récupérer les attestations par l'id d'une source (demo)
	getAttestationsBySourceId: async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			// on récupère params et query
			const { sourceId } = req.params;

			// on récupère le texte de la requête SQL
			const sqlQuery = getAttestationsBySourceId();
			const sourceWithAttestations = await mapDataSource.query(sqlQuery, [
				sourceId,
			]);

			if (sourceWithAttestations.length === 0) {
				res.status(404).send({ Erreur: "Source non trouvée" });
				return;
			}

			res.status(200).json(sourceWithAttestations[0].attestations);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
