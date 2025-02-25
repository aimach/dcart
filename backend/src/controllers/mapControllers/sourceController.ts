// import des entités
import { MapContent } from "../../entities/MapContent";
// import des services
import { dcartDataSource, MapDataSource } from "../../dataSource/dataSource";
import {
	getAttestationsBySourceId,
	getSourcesQueryWithDetails,
	getSourcesQueryWithoutDetails,
} from "../../utils/query/sourceQueryString";
import {
	getQueryStringForLocalisationFilter,
	getQueryStringForDateFilter,
	getQueryStringForIncludedElements,
	getQueryStringForExcludedElements,
	getQueryStringForLanguage,
} from "../../utils/functions/functions";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const sourceController = {
	// récupérer toutes les sources
	getSourcesByMapId: async (req: Request, res: Response): Promise<void> => {
		try {
			// on récupère params et query
			const { mapId } = req.params;

			// on prépare la variable à renvoyer
			let results = null;

			if (mapId === "exploration") {
				// on récupère le texte de la requête SQL
				const sqlQuery = getSourcesQueryWithoutDetails(
					"",
					"<=", // obligé d'intégrer les opérateurs ici, sinon ça plante
					"=",
					"",
					"",
					"",
				);
				results = await MapDataSource.query(sqlQuery, [3, 1]);
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

				// s'il existe des params, on remplace les valeurs par celles des params
				if (req.query.locationId) {
					queryLocalisation = req.query.locationId
						? getQueryStringForLocalisationFilter(
								req.query.locationId as string,
							)
						: queryLocalisation;
				}

				if (req.query.ante || req.query.post) {
					const maxValue = req.query.ante ? req.query.ante.toString() : null;
					const minValue = req.query.post ? req.query.post.toString() : null;
					queryDatation = getQueryStringForDateFilter(maxValue, minValue);
				}

				// ici se fait la récupération des épithètes, qui ne peut plus fonctionner dans ce cas
				// if (req.query.elementId) {
				// 	queryIncludedElements = getQueryStringForIncludedElements(
				// 		includedElements as string,
				// 		req.query.elementId as string,
				// 	);
				// }

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
				);

				results = await MapDataSource.query(sqlQuery);
			}

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	getAttestationsBySourceId: async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			// on récupère params et query
			const { sourceId } = req.params;

			// on récupère le texte de la requête SQL
			const sqlQuery = getAttestationsBySourceId(
				"<=", // obligé d'intégrer les opérateurs ici, sinon ça plante
			);
			const sourceWithAttestations = await MapDataSource.query(sqlQuery, [
				3,
				sourceId,
			]);

			res.status(200).json(sourceWithAttestations[0].attestations);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
