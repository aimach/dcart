// import des entités
import { MapContent } from "../../entities/MapContent";
// import des services
import { dcartDataSource, MapDataSource } from "../../dataSource/dataSource";
import {
	getAttestationsBySourceId,
	getSourcesByCoordinates,
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
				const { locationType, locationId, element, ante, post } = req.query;
				// on prépare les query des filtres
				const queryLocalisation = "";
				const queryDatation =
					ante && post
						? getQueryStringForDateFilter(ante as string, post as string)
						: "";
				const queryIncludedElements = element
					? getQueryStringForIncludedElements(element as string, "")
					: "";

				// on récupère le texte de la requête SQL
				const sqlQuery = getSourcesQueryWithoutDetails(
					queryLocalisation,
					">", // obligé d'intégrer les opérateurs ici, sinon ça plante
					queryDatation,
					queryIncludedElements,
					"",
				);
				results = await MapDataSource.query(sqlQuery, [1]);
			} else {
				// on récupère les informations de la carte
				const mapInfos = await dcartDataSource
					.getRepository(MapContent)
					.findOneBy({ id: mapId });
				if (!mapInfos) {
					res.status(404).send({ Erreur: "Carte non trouvée" });
				}

				// on récupère les éléments à filtrer depuis les informations de la carte
				const {
					elementNb,
					elementOperator,
					divinityNb,
					divinityOperator,
					locationType,
					locationId,
					ante,
					post,
					includedElements,
					excludedElements,
				} = mapInfos as MapContent;

				// on prépare les query des filtres
				let queryLocalisation =
					locationType && locationId
						? getQueryStringForLocalisationFilter(
								locationType as string,
								locationId as string,
							)
						: "";
				const maxValue = ante ? ante.toString() : null;
				const minValue = post ? post.toString() : null;
				let queryDatation = getQueryStringForDateFilter(maxValue, minValue);
				let queryIncludedElements = includedElements
					? getQueryStringForIncludedElements(includedElements, "")
					: "";
				const queryExcludedElements = excludedElements
					? getQueryStringForExcludedElements(excludedElements)
					: "";

				// s'il existe des params, on remplace les valeurs par celles des params
				if (req.query.locationType && req.query.locationId) {
					queryLocalisation =
						req.query.locationType && req.query.locationId
							? getQueryStringForLocalisationFilter(
									req.query.locationType as string,
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
					queryIncludedElements = getQueryStringForIncludedElements(
						includedElements as string,
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
					queryLocalisation,
					elementOperator, // obligé d'intégrer les opérateurs ici, sinon ça plante
					divinityOperator,
					queryDatation,
					queryIncludedElements,
					queryExcludedElements,
					queryLanguage,
				);

				results = await MapDataSource.query(sqlQuery, [elementNb, divinityNb]);
			}

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	getSourcesAndAttestationsByCoordinates: async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			// on récupère params et query
			const { lat, lon } = req.params;

			// on récupère le texte de la requête SQL
			const sqlQuery = getSourcesByCoordinates(
				"<=", // obligé d'intégrer les opérateurs ici, sinon ça plante
				"=",
			);
			const sourceWithAttestations = await MapDataSource.query(sqlQuery, [
				3,
				lat,
				lon,
				1,
			]);

			res.status(200).json(sourceWithAttestations);
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
