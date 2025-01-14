// import des bibliothèques
import type { Request, Response } from "express";
// import des entités
// import des services
import { MapDataSource } from "../dataSource/dataSource";
import { getSourcesQuery } from "../utils/query/sourceQueryString";
import {
	getQueryStringForGodsFilter,
	getQueryStringForLocalisationFilter,
	getQueryStringForLanguageFilter,
	getQueryStringForDateFilter,
} from "../utils/functions/functions";
// import des types

export const mapController = {
	// récupérer toutes les sources
	getSourcesByElementId: async (req: Request, res: Response): Promise<void> => {
		try {
			// on récupère les paramètres
			const { elementId } = req.params;
			const {
				elementNbByAttestation,
				divinityPowerNb,
				gods,
				localisation,
				languages,
				ante,
				post,
			} = req.query;

			// on prépare les réglages par défaut s'ils ne sont pas indiqués
			elementNbByAttestation ? elementNbByAttestation : 3;
			divinityPowerNb ? divinityPowerNb : 1;
			// on prépare les query des filtres
			const queryElements = gods
				? getQueryStringForGodsFilter(gods as string)
				: "";
			const queryLocalisation = localisation
				? getQueryStringForLocalisationFilter(localisation as string)
				: "";
			const queryLanguage = languages
				? getQueryStringForLanguageFilter(languages as string)
				: "";
			const queryAnte = ante
				? getQueryStringForDateFilter("ante", ante as string)
				: "";
			const queryPost = post
				? getQueryStringForDateFilter("post", post as string)
				: "";

			// on récupère le texte de la requête SQL
			const sqlQuery = getSourcesQuery(
				"element",
				queryElements,
				queryLocalisation,
				queryLanguage as string,
				queryAnte as string,
				queryPost as string,
			);

			// légende des paramètres : nombre d'éléments par attestation, id du théonyme/épithète, nombre de puissances divines
			const results = await MapDataSource.query(sqlQuery, [
				elementNbByAttestation ? elementNbByAttestation : 3,
				`{${elementId}}`,
				divinityPowerNb ? divinityPowerNb : 1,
			]);

			res.status(200).json(results);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({
					message: error.message,
					stack: error.stack,
					error: error,
				});
				return;
			}
			res.status(500).json({
				message: "Erreur inattendue",
				error: error,
			});
		}
	},
};
