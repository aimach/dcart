// import des entités
import { Filter } from "../../../entities/builtMap/Filter";
import { MapContent } from "../../../entities/builtMap/MapContent";
import { FilterMapContent } from "../../../entities/builtMap/FilterMapContent";
// import des services
import { dcartDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";
import type { FilterType } from "../../../entities/builtMap/Filter";

export const filterController = {
	// récupère tous les filtres
	getFilters: async (req: Request, res: Response): Promise<void> => {
		try {
			const { filterId } = req.params;
			let results = null;

			if (filterId === "all") {
				results = await dcartDataSource.getRepository(Filter).find();
				res.status(200).json(results);
				return;
			}
			results = await dcartDataSource.getRepository(Filter).find({
				where: { id: filterId },
			});

			if (!results) {
				res.status(404).json({ message: "Filtre non trouvé" });
				return;
			}

			res.status(200).json(results[0]);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// ajoute un ou des filtres à une carte
	addFiltersToMap: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId } = req.params;

			const map = await dcartDataSource.getRepository(MapContent).findOne({
				where: { id: mapId },
			});
			if (!map) {
				res.status(404).json({ message: "Carte non trouvée" });
				return;
			}

			const newFilters = [];
			for (const filter in req.body) {
				if (req.body[filter]) {
					// si le filtre est coché
					const filterToAdd = await dcartDataSource
						.getRepository(Filter)
						.findOne({
							where: { type: filter as FilterType },
						});
					if (filterToAdd) {
						newFilters.push(filterToAdd);
					} else {
						res
							.status(404)
							.json({ message: `Filtre non trouvé, id : ${filter}` });
						return;
					}
				}
			}

			// on ajoute les filtres à la carte
			Promise.all(
				newFilters.map(async (filter: Filter) => {
					await dcartDataSource.getRepository(FilterMapContent).save({
						filter: filter,
						mapContent: map,
					});
				}),
			);

			res.status(201).json({ message: "Filtres ajoutés à la carte" });
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// modification des options d'un filtre d'une carte
	updateFilterOptions: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId, filterType } = req.params;

			const map = await dcartDataSource.getRepository(MapContent).findOne({
				where: { id: mapId },
				relations: ["filterMapContent"],
			});
			if (!map) {
				res.status(404).json({ message: "Carte non trouvée" });
				return;
			}

			const filter = await dcartDataSource.getRepository(Filter).findOne({
				where: { type: filterType as FilterType },
			});
			if (!filter) {
				res.status(404).json({ message: "Filtre non trouvé" });
				return;
			}

			const filterMapContentToUpdate = await dcartDataSource
				.getRepository(FilterMapContent)
				.createQueryBuilder("filterMapContent")
				.where("filterMapContent.mapId = :mapId", { mapId: map.id })
				.andWhere("filterMapContent.filterId = :filterId", {
					filterId: filter.id,
				})
				.getOne();

			if (!filterMapContentToUpdate) {
				res.status(404).json({ message: "Ensemble filtre-carte non trouvé" });
				return;
			}

			const newfilterMapContent = await dcartDataSource
				.getRepository(FilterMapContent)
				.create({
					...filterMapContentToUpdate,
					options: req.body,
				});

			await dcartDataSource
				.getRepository(FilterMapContent)
				.save(newfilterMapContent);

			const newMap = res
				.status(201)
				.json({ message: "Option ajoutée à la carte" });
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// modification d'un ou des filtres d'une carte
	updateFiltersToMap: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId } = req.params;

			const map = await dcartDataSource.getRepository(MapContent).findOne({
				where: { id: mapId },
				relations: ["filterMapContent"],
			});
			if (!map) {
				res.status(404).json({ message: "Carte non trouvée" });
				return;
			}

			const newFilters = [];
			for (const filter in req.body) {
				if (req.body[filter]) {
					// si le filtre est coché
					const filterToAdd = await dcartDataSource
						.getRepository(Filter)
						.findOne({
							where: { type: filter as FilterType },
						});
					if (filterToAdd) {
						newFilters.push(filterToAdd);
					} else {
						res
							.status(404)
							.json({ message: `Filtre non trouvé, id : ${filter}` });
						return;
					}
				}
			}

			// on supprime les filtres de la carte
			await dcartDataSource.getRepository(FilterMapContent).delete({ map });

			// on ajoute les filtres à la carte
			Promise.all(
				newFilters.map(async (filter: Filter) => {
					await dcartDataSource.getRepository(FilterMapContent).save({
						filter: filter,
						map: map,
					});
				}),
			);

			res.status(200).json({ message: "Nouveaux filtres ajoutés à la carte" });
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
