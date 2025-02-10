// import des entités
import { MapContent } from "../../entities/MapContent";
// import des services
import { dcartDataSource, MapDataSource } from "../../dataSource/dataSource";
import {
	getSourcesQueryWithDetails,
	getSourcesQueryWithoutDetails,
} from "../../utils/query/sourceQueryString";
import {
	getQueryStringForLocalisationFilter,
	getQueryStringForDateFilter,
	getQueryStringForIncludedElements,
	getQueryStringForExcludedElements,
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
				const { location, element, ante, post } = req.query;
				// on prépare les query des filtres
				const queryLocalisation = location
					? getQueryStringForLocalisationFilter(
							"greatRegion",
							Number.parseInt(location as string, 10),
						)
					: "";
				const queryAnte = ante
					? getQueryStringForDateFilter(
							"ante",
							Number.parseInt(ante as string, 10),
						)
					: "";
				const queryPost = post
					? getQueryStringForDateFilter(
							"post",
							Number.parseInt(post as string, 10),
						)
					: "";
				const queryIncludedElements = element
					? getQueryStringForIncludedElements(element as string)
					: "";

				// on récupère le texte de la requête SQL
				const sqlQuery = getSourcesQueryWithoutDetails(
					queryLocalisation,
					"<=", // obligé d'intégrer les opérateurs ici, sinon ça plante
					"=",
					queryAnte,
					queryPost,
					queryIncludedElements,
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
				const queryLocalisation = getQueryStringForLocalisationFilter(
					locationType,
					locationId,
				);
				const queryAnte = ante ? getQueryStringForDateFilter("ante", ante) : "";
				const queryPost = post ? getQueryStringForDateFilter("post", post) : "";
				const queryIncludedElements = includedElements
					? getQueryStringForIncludedElements(includedElements)
					: "";
				const queryExcludedElements = excludedElements
					? getQueryStringForExcludedElements(excludedElements)
					: "";

				// on récupère le texte de la requête SQL
				const sqlQuery = getSourcesQueryWithDetails(
					queryLocalisation,
					elementOperator, // obligé d'intégrer les opérateurs ici, sinon ça plante
					divinityOperator,
					queryAnte,
					queryPost as string,
					queryIncludedElements,
					queryExcludedElements,
				);

				results = await MapDataSource.query(sqlQuery, [elementNb, divinityNb]);
			}

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
