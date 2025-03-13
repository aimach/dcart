// import des entités
import { MapContent } from "../../../entities/builtMap/MapContent";
import { Category } from "../../../entities/builtMap/Category";
// import des services
import { dcartDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const mapContentController = {
	// récupérer les données de toutes les cartes ou d'une carte en particulier
	getMapContent: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId } = req.params;

			if (mapId === "all") {
				if (req.query.isActive) {
					const isActive = req.query.isActive === "true";
					const allMaps = await dcartDataSource
						.getRepository(MapContent)
						.find({ where: { isActive }, relations: ["filters", "category"] });
					res.status(200).send(allMaps);
					return;
				}
				const allMaps = await dcartDataSource
					.getRepository(MapContent)
					.find({ relations: ["filters", "category"] });
				res.status(200).send(allMaps);
				return;
			}

			const mapInfos = await dcartDataSource
				.getRepository(MapContent)
				.find({ where: { id: mapId }, relations: ["filters", "category"] });
			if (!mapInfos) {
				res.status(404).send({ Erreur: "Carte non trouvée" });
			} else {
				res.status(200).send(mapInfos[0]);
			}
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// créer une nouvelle carte
	createMap: async (req: Request, res: Response): Promise<void> => {
		try {
			const {
				title_en,
				title_fr,
				description_en,
				description_fr,
				category,
				attestationIds,
			} = req.body;

			const newMap = dcartDataSource.getRepository(MapContent).create({
				title_en,
				title_fr,
				description_en,
				description_fr,
				category: category,
				attestationIds,
			});

			await dcartDataSource.getRepository(MapContent).save(newMap);

			res.status(201).send(newMap);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// met à jour une carte
	updateMap: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId } = req.params;

			const mapToUpdate = await dcartDataSource
				.getRepository(MapContent)
				.findOne({
					where: { id: mapId },
					relations: ["category", "filters"],
				});

			if (!mapToUpdate) {
				res.status(404).send("Carte non trouvée.");
				return;
			}

			// si c'est la mise à jour du statut de la carte
			if (req.query.isActive) {
				mapToUpdate.isActive = req.query.isActive === "true";
				const updatedMap = await dcartDataSource
					.getRepository(MapContent)
					.save(mapToUpdate);
				res.status(200).send(updatedMap);
				return;
			}

			// si la catégorie de la carte a été modifiée, ajout de la nouvelle catégorie au body
			const newCategory = await dcartDataSource
				.getRepository(Category)
				.findOne({
					where: { id: req.body.category.id },
				});
			req.body.category = newCategory;

			const updatedMap = await dcartDataSource
				.getRepository(MapContent)
				.create({
					...mapToUpdate,
					...req.body,
				});

			const newMap = await dcartDataSource
				.getRepository(MapContent)
				.save(updatedMap);

			res.status(200).send(newMap);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// supprime une carte
	deleteMap: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId } = req.params;

			const mapToDelete = await dcartDataSource
				.getRepository(MapContent)
				.findOne({
					where: { id: mapId },
				});

			if (!mapToDelete) {
				res.status(404).send("Carte non trouvée.");
				return;
			}

			await dcartDataSource.getRepository(MapContent).delete(mapId);

			res.status(200).send("Carte supprimée.");
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
