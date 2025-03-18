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
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

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
				if (req.query.greek === "false") {
					queryLanguage = getQueryStringForLanguage("greek", queryLanguage);
				}
				if (req.query.semitic === "false") {
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
					.findOneBy({ id: mapId });
				if (!mapInfos) {
					res.status(404).send({ Erreur: "Carte non trouvée" });
				}

				const { attestationIds } = mapInfos as MapContent;

				// on prépare les query des filtres
				let queryLocalisation = "";
				const maxValue = null;
				const minValue = null;
				let queryDatation = getQueryStringForDateFilter(maxValue, minValue);
				let queryIncludedElements = "";

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
					const maxValue = req.query.ante ? req.query.ante.toString() : null;
					const minValue = req.query.post ? req.query.post.toString() : null;
					queryDatation = getQueryStringForDateFilter(maxValue, minValue);
				}

				// ici se fait la récupération des épithètes
				if (req.query.elementId) {
					queryIncludedElements = getQueryStringForIncludedElements(
						mapId,
						req.query.elementId as string,
					);
				}

				let queryLanguage = "";
				if (req.query.greek === "false") {
					queryLanguage = getQueryStringForLanguage("greek", queryLanguage);
				}
				if (req.query.semitic === "false") {
					queryLanguage = getQueryStringForLanguage("semitic", queryLanguage);
				}

				// on récupère le texte de la requête SQL
				const sqlQuery = getSourcesQueryWithDetails(
					attestationIds,
					queryLocalisation,
					queryDatation,
					queryLanguage,
					queryIncludedElements,
				);

				results = await mapDataSource.query(sqlQuery);
			}

			res.status(200).json(results);
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
