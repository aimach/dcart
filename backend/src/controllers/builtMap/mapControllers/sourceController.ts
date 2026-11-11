// import des entités
import { MapContent } from "../../../entities/builtMap/MapContent";
import type { Attestation } from "../../../entities/common/Attestation";
import { Block } from "../../../entities/storymap/Block";
// import des services
import { dcartDataSource, mapDataSource } from "../../../dataSource/dataSource";
import {
	getAttestationsBySourceIdWithFilters,
	getSourcesQueryWithDetails,
	getSourcesQueryWithoutDetails,
} from "../../../utils/query/sourceQueryString";
import {
	toIdList,
	getQueryStringForLocalisationFilter,
	getQueryStringForPlaceFilter,
	getQueryStringForDateFilter,
	getQueryStringForIncludedElements,
	getQueryStringForLanguage,
	getQueryStringForAgentGender,
	getQueryStringForAgentStatus,
	getQueryStringForAgentivity,
	getQueryStringForSourceMaterial,
	getQueryStringForDivinityNb,
	getQueryStringForSourceType,
} from "../../../utils/query/filtersQueryString";
import {
	attestationMatchesLot,
	sortSourcesByDate,
} from "../../../utils/functions/builtMap";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { PointType } from "../../../utils/types/mapTypes";
import type { Request, Response } from "express";

export const sourceController = {
	// récupérer toutes les sources à partir de l'id de la carte
	getSourcesByMapId: async (req: Request, res: Response): Promise<void> => {
		try {
			// on récupère params et query
			const { mapId } = req.params;
			const {
				greek,
				semitic,
				locationId,
				placeId,
				lotIds,
				ante,
				post,
				elementId,
				minDivinityNb,
				maxDivinityNb,
				sourceTypeId,
				agentActivityId,
				agentNameId,
				agentGender,
				agentStatusName,
				agentivityName,
				sourceMaterialName,
			} = req.body;

			// on prépare la variable à renvoyer
			let results = null;

			if (mapId === "exploration") {
				// on prépare les query des filtres
				let queryLocalisation = "";
				let queryDatation = "";
				let queryIncludedElements = "";
				// valeurs des filtres passées en paramètres SQL ($1, $2...)
				const queryParams: unknown[] = [];

				if (typeof locationId === "string" && locationId !== "") {
					const { query, param } = getQueryStringForLocalisationFilter(
						locationId,
						"greatRegion",
						queryParams.length + 1,
					);
					queryParams.push(param);
					queryLocalisation += query;
				}

				// filtre par lieu (localité d'origine ou de découverte)
				if (typeof placeId === "string" && placeId !== "") {
					queryParams.push(placeId.split("|"));
					queryLocalisation += getQueryStringForPlaceFilter(queryParams.length);
				}

				if (ante !== undefined || post !== undefined) {
					const maxValue = ante !== undefined ? ante.toString() : null;
					const minValue = post !== undefined ? post.toString() : null;
					const { query, params } = getQueryStringForDateFilter(
						maxValue,
						minValue,
						queryParams.length + 1,
					);
					queryParams.push(...params);
					queryDatation = query;
				}

				if (elementId) {
					// ici se fait la récupération des épithètes
					const { query, param } = getQueryStringForIncludedElements(
						mapId,
						elementId as string,
						queryParams.length + 1,
					);
					if (param) queryParams.push(param);
					queryIncludedElements = query;
				}

				let queryLanguage = "";
				if (greek) {
					queryLanguage = getQueryStringForLanguage("greek", queryLanguage);
				}
				if (semitic) {
					queryLanguage = getQueryStringForLanguage("semitic", queryLanguage);
				}

				// on récupère le texte de la requête SQL
				const sqlQuery = getSourcesQueryWithoutDetails(
					queryLocalisation,
					queryDatation,
					queryIncludedElements,
					queryLanguage,
				);
				results = await mapDataSource.query(sqlQuery, queryParams);
			} else {
				// on récupère les informations de la carte
				const mapInfos = await dcartDataSource
					.getRepository(MapContent)
					.createQueryBuilder("map")
					.leftJoinAndSelect("map.attestations", "attestations")
					.leftJoinAndSelect("attestations.icon", "icon")
					.leftJoinAndSelect("attestations.color", "color")
					.leftJoinAndSelect("map.filterMapContent", "filterMapContent")
					.leftJoinAndSelect("filterMapContent.filter", "filter")
					.where("map.id = :id", { id: mapId })
					.getOne();
				if (!mapInfos) {
					res.status(404).send({ Erreur: "Carte non trouvée" });
					return;
				}

				// on prépare les query des filtres
				let queryLocalisation = "";
				let queryDatation = "";
				let queryIncludedElements = "";
				let queryDivinityNb = "";
				let querySourceType = "";
				let queryAgentGender = "";
				let queryAgentStatus = "";
				let queryAgentivityName = "";
				let querySourceMaterialName = "";
				// valeurs des filtres passées en paramètres SQL ($1, $2...)
				const queryParams: unknown[] = [];

				// s'il existe des params, on remplace les valeurs par celles des params
				if (locationId) {
					const locationFilter = mapInfos?.filterMapContent?.find(
						(filter) => filter.filter?.type === "location",
					);
					const locationLevel =
						locationFilter?.options?.solution ?? "greatRegion";
					if (typeof locationId === "string" && locationId !== "") {
						const { query, param } = getQueryStringForLocalisationFilter(
							locationId,
							locationLevel,
							queryParams.length + 1,
						);
						queryParams.push(param);
						queryLocalisation = query;
					}
				}

				if (ante !== undefined || post !== undefined) {
					const maxDateValue = ante !== undefined ? ante.toString() : null;
					const minDateValue = post !== undefined ? post.toString() : null;
					const { query, params } = getQueryStringForDateFilter(
						maxDateValue,
						minDateValue,
						queryParams.length + 1,
					);
					queryParams.push(...params);
					queryDatation = query;
				}

				// ici se fait la récupération des épithètes
				if (elementId) {
					const { query, param } = getQueryStringForIncludedElements(
						mapId,
						elementId as string,
						queryParams.length + 1,
					);
					if (param) queryParams.push(param);
					queryIncludedElements = query;
				}

				let queryLanguage = "";
				if (greek) {
					queryLanguage = getQueryStringForLanguage("greek", queryLanguage);
				}
				if (semitic) {
					queryLanguage = getQueryStringForLanguage("semitic", queryLanguage);
				}

				if (minDivinityNb && maxDivinityNb) {
					const { query, params } = getQueryStringForDivinityNb(
						minDivinityNb,
						maxDivinityNb,
						queryParams.length + 1,
					);
					queryParams.push(...params);
					queryDivinityNb = query;
				}

				if (typeof sourceTypeId === "string" && sourceTypeId !== "") {
					const { query, param } = getQueryStringForSourceType(
						sourceTypeId,
						queryParams.length + 1,
					);
					queryParams.push(param);
					querySourceType = query;
				}

				if (agentGender) {
					queryAgentGender = getQueryStringForAgentGender(agentGender);
				}

				if (typeof agentStatusName === "string" && agentStatusName !== "") {
					const { query, param } = getQueryStringForAgentStatus(
						agentStatusName,
						queryParams.length + 1,
					);
					queryParams.push(param);
					queryAgentStatus = query;
				}

				if (typeof agentivityName === "string" && agentivityName !== "") {
					const { query, param } = getQueryStringForAgentivity(
						agentivityName,
						queryParams.length + 1,
					);
					queryParams.push(param);
					queryAgentivityName = query;
				}

				if (
					typeof sourceMaterialName === "string" &&
					sourceMaterialName !== ""
				) {
					const { query, param } = getQueryStringForSourceMaterial(
						sourceMaterialName,
						querySourceType,
						queryParams.length + 1,
					);
					queryParams.push(param);
					querySourceMaterialName = query;
				}

				const { attestations } = mapInfos as MapContent;
				results = await Promise.all(
					attestations.map(async (attestation: Attestation) => {
						if (!attestation.attestationIds) {
							return [];
						}
						// chaque requête a son propre tableau de paramètres (les requêtes tournent en parallèle)
						const attestationParams = [
							...queryParams,
							toIdList(attestation.attestationIds),
						];
						const sqlQuery = getSourcesQueryWithDetails(
							`$${attestationParams.length}`,
							queryLocalisation,
							queryDatation,
							queryLanguage,
							queryIncludedElements,
							queryDivinityNb,
							querySourceType,
							queryAgentGender,
							queryAgentStatus,
							queryAgentivityName,
							querySourceMaterialName,
						);

						const queryResults = await mapDataSource.query(
							sqlQuery,
							attestationParams,
						);

						// on trie les sources si lotIds est présent
						let filteredResults = [];
						if (lotIds && lotIds.length > 0) {
							const lotIdsArray: number[][] = [];

							// on crée un tableau contenant les paires [id premier niveau, id second niveau]
							if (lotIds[0].length === 1)
								lotIdsArray.push([lotIds[0][0], lotIds[0][0]]);
							lotIds.map((lot: number[]) => {
								for (let index = 1; index < lot.length; index++) {
									lotIdsArray.push([lot[0], lot[index]]);
								}
							});

							const filterPointsByValidLots = (
								points: PointType[],
								lotIdsArray: number[][],
							) => {
								return points
									.map((point) => {
										const filteredSources = point.sources
											?.map((source) => {
												const filteredAttestations =
													source.attestations?.filter((attestation) =>
														attestationMatchesLot(attestation, lotIdsArray),
													);

												if (
													filteredAttestations &&
													filteredAttestations.length > 0
												) {
													return {
														...source,
														attestations: filteredAttestations,
													};
												}
												return null;
											})
											.filter((source) => source !== null);

										if (filteredSources && filteredSources.length > 0) {
											return { ...point, sources: filteredSources };
										}
										return null;
									})
									.filter((point) => point !== null);
							};

							filteredResults = filterPointsByValidLots(
								queryResults,
								lotIdsArray,
							);
						} else {
							filteredResults = queryResults;
						}

						// on filtre les sources si agentActivityId, agentNameId sont présents
						if (
							agentActivityId ||
							agentNameId ||
							agentStatusName ||
							agentivityName
						) {
							filteredResults = filteredResults
								.map((point: PointType) => {
									const filteredSources = point.sources
										?.map((source) => {
											const filteredAttestations = source.attestations
												?.map((attestation) => {
													const filteredAgents = attestation.agents?.filter(
														(agent) => {
															let activityBoolean = true;
															let nameBoolean = true;
															let statusBoolean = true;
															let agentivityBoolean = true;
															if (agentActivityId) {
																if (agent.activite_id) {
																	if (agentActivityId.includes("|")) {
																		const agentActivityIds =
																			agentActivityId.split("|");
																		activityBoolean = agentActivityIds.includes(
																			agent.activite_id.toString(),
																		);
																	} else {
																		activityBoolean =
																			agent.activite_id.toString() ===
																			agentActivityId;
																	}
																} else {
																	activityBoolean = false;
																}
															}
															if (agentNameId) {
																if (agent.designation) {
																	if (agentNameId.includes("|")) {
																		const agentNameIds = agentNameId.split("|");
																		nameBoolean = agentNameIds.includes(
																			agent.designation,
																		);
																	} else {
																		nameBoolean =
																			agent.designation === agentNameId;
																	}
																} else {
																	nameBoolean = false;
																}
															}
															if (agentStatusName) {
																if (agent.statut_fr) {
																	if (agentStatusName.includes("|")) {
																		const agentStatusNames =
																			agentStatusName.split("|");
																		statusBoolean = agentStatusNames.includes(
																			agent.statut_fr,
																		);
																	} else {
																		statusBoolean =
																			agent.statut_fr === agentStatusName;
																	}
																} else {
																	statusBoolean = false;
																}
															}
															if (agentivityName) {
																if (agent.agentivites) {
																	for (const agentivity of agent.agentivites) {
																		if (agentivity.nom_fr === agentivityName) {
																			if (agentivityName.includes("|")) {
																				const agentivityNames =
																					agentivityName.split("|");
																				agentivityBoolean =
																					agentivityNames.includes(agentivity);
																			} else {
																				agentivityBoolean =
																					agentivity.nom_fr === agentivityName;
																			}
																		}
																	}
																} else {
																	agentivityBoolean = false;
																}
															}
															return (
																nameBoolean &&
																activityBoolean &&
																statusBoolean &&
																agentivityBoolean
															);
														},
													);
													if (filteredAgents && filteredAgents.length > 0) {
														return {
															...attestation,
															agents: filteredAgents,
														};
													}
													return null;
												})
												.filter((attestation) => attestation !== null);
											if (
												filteredAttestations &&
												filteredAttestations.length > 0
											) {
												return {
													...source,
													attestations: filteredAttestations,
												};
											}
											return null;
										})
										.filter((source) => source !== null);
									if (filteredSources && filteredSources.length > 0) {
										return { ...point, sources: filteredSources };
									}
									return null;
								})
								.filter((point: PointType) => point !== null);
						}

						// on filtre si agentGender est présent pour enlever les agents null
						const isAgentGenderFilter =
							agentGender &&
							(agentGender.male || agentGender.female || agentGender.nonBinary);
						if (isAgentGenderFilter) {
							// au moins un genre est sélectionné
							filteredResults = filteredResults
								.map((point: PointType) => {
									const filteredSources = point.sources
										?.map((source) => {
											const filteredAttestations = source.attestations
												?.map((attestation) => {
													const filteredAgents = attestation.agents?.filter(
														(agent) => agent.genres,
													);
													if (filteredAgents && filteredAgents.length > 0) {
														return {
															...attestation,
															agents: filteredAgents,
														};
													}
													return null;
												})
												.filter((attestation) => attestation !== null);
											if (
												filteredAttestations &&
												filteredAttestations.length > 0
											) {
												return {
													...source,
													attestations: filteredAttestations,
												};
											}
											return null;
										})
										.filter((source) => source !== null);
									if (filteredSources && filteredSources.length > 0) {
										return { ...point, sources: filteredSources };
									}
									return null;
								})
								.filter((point: PointType) => point !== null);
						}

						// on trie les attestations par id
						const sortedAttestations = filteredResults.map(
							(point: PointType) => {
								return {
									...point,
									sources: point.sources?.map((source) => {
										return {
											...source,
											attestations: source.attestations?.sort(
												(a, b) => a.attestation_id - b.attestation_id,
											),
										};
									}),
								};
							},
						);

						// on trie les sources de chaque point par date
						const sortedResults = sortedAttestations.map((point: PointType) => {
							return {
								...point,
								sources: sortSourcesByDate(point.sources),
								color: attestation.color?.code_hex,
								shape: attestation.icon?.name_en,
								layerNamefr: attestation.name_fr,
								layerNameen: attestation.name_en,
								position: attestation.position,
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
	// récupérer toutes les sources à partir de l'id de la carte
	getSourcesByBlockId: async (req: Request, res: Response): Promise<void> => {
		try {
			// on récupère params et query
			const { blockId } = req.params;
			const { side } = req.query;

			// on prépare la variable à renvoyer
			let results = null;

			// on récupère les informations de la carte
			const blockQuery = await dcartDataSource
				.getRepository(Block)
				.createQueryBuilder("block")
				.leftJoinAndSelect("block.attestations", "attestations")
				.leftJoinAndSelect("attestations.icon", "icon")
				.leftJoinAndSelect("attestations.color", "color")
				.leftJoinAndSelect(
					"attestations.customPointsArray",
					"customPointsArray",
				)
				.where("block.id = :id", { id: blockId });

			if (side) {
				blockQuery.andWhere("attestations.name_fr = :side", { side });
			}

			const blockInfos = await blockQuery.getOne();

			if (!blockInfos) {
				res.status(404).send({ Erreur: "Block non trouvé" });
				return;
			}

			const attestationsArray = blockInfos?.attestations ?? [];

			results = await Promise.all(
				attestationsArray.map(async (attestation: Attestation) => {
					if (!attestation.attestationIds) {
						return [];
					}
					const sqlQuery = getSourcesQueryWithDetails(
						"$1",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
						"",
					);

					const queryResults = await mapDataSource.query(sqlQuery, [
						toIdList(attestation.attestationIds),
					]);

					// on trie les sources de chaque point par date
					const sortedResults = queryResults.map((point: PointType) => {
						return {
							...point,
							sources: sortSourcesByDate(point.sources),
							color: attestation.color?.code_hex,
							shape: attestation.icon?.name_en,
							layerNamefr: attestation.name_fr,
							layerNameen: attestation.name_en,
						};
					});
					return sortedResults;
				}),
			);

			const customPointsArray = attestationsArray.map(
				(attestation: Attestation) => {
					return attestation.customPointsArray?.map((point) => {
						const sourcesArray = [];
						for (let index = 1; index <= (point.source_nb || 1); index++) {
							sourcesArray.push(index);
						}
						return {
							latitude: point.latitude,
							longitude: point.longitude,
							nom_ville: point.location,
							layerNamefr: attestation.name_fr,
							layerNameen: attestation.name_en,
							color: attestation.color?.code_hex,
							shape: attestation.icon?.name_en,
							sources: sourcesArray,
						};
					});
				},
			);

			res.status(200).json(results.flat().concat(customPointsArray.flat()));
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
				"$1",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
			);

			const results = await mapDataSource.query(sqlQuery, [
				toIdList(attestationIds),
			]);

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
			const { locationId, elementId, greek, semitic, ante, post } = req.body;

			// on prépare les query des filtres
			let queryLocalisation = "";
			let queryDatation = "";
			let queryIncludedElements = "";
			// $1 est réservé à l'id de la source
			const queryParams: unknown[] = [sourceId];

			if (typeof locationId === "string" && locationId !== "") {
				const { query, param } = getQueryStringForLocalisationFilter(
					locationId,
					"greatRegion",
					queryParams.length + 1,
				);
				queryParams.push(param);
				queryLocalisation = query;
			}

			if (ante !== undefined || post !== undefined) {
				const maxValue = ante !== undefined ? ante.toString() : null;
				const minValue = post !== undefined ? post.toString() : null;
				const { query, params } = getQueryStringForDateFilter(
					maxValue,
					minValue,
					queryParams.length + 1,
				);
				queryParams.push(...params);
				queryDatation = query;
			}

			if (elementId) {
				// ici se fait la récupération des épithètes
				const { query, param } = getQueryStringForIncludedElements(
					"exploration",
					elementId as string,
					queryParams.length + 1,
				);
				if (param) queryParams.push(param);
				queryIncludedElements = query;
			}

			let queryLanguage = "";
			if (greek) {
				queryLanguage = getQueryStringForLanguage("greek", queryLanguage);
			}
			if (semitic) {
				queryLanguage = getQueryStringForLanguage("semitic", queryLanguage);
			}

			// on récupère le texte de la requête SQL
			const sqlQuery = getAttestationsBySourceIdWithFilters(
				queryLocalisation,
				queryDatation,
				queryIncludedElements,
				queryLanguage,
			);
			const sourceWithAttestations = await mapDataSource.query(
				sqlQuery,
				queryParams,
			);

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
