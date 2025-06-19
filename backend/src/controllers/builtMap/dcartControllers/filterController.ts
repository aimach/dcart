// import des entités
import { Filter } from "../../../entities/builtMap/Filter";
import { MapContent } from "../../../entities/builtMap/MapContent";
import { FilterMapContent } from "../../../entities/builtMap/FilterMapContent";
// import des services
import { dcartDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

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
							where: { type: filter as string },
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
				newFilters.map((filter: Filter) => {
					dcartDataSource.getRepository(FilterMapContent).save({
						filter: filter,
						map: map,
						options: filter.type === "element" ? { solution: "manual" } : null,
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
				where: { type: filterType as string },
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

			// si c'est le filtre "element", conserver les options existantes pour le type "manual"
			if (filterType === "element" && filterMapContentToUpdate?.options) {
				const existingOptions = filterMapContentToUpdate.options;
				const checkboxMustBeSaved =
					(existingOptions.solution === "manual" &&
						req.body.solution === "basic") ||
					(existingOptions.solution === "basic" &&
						req.body.solution === "manual");
				if (checkboxMustBeSaved) {
					req.body = {
						checkbox: existingOptions.checkbox,
						...req.body,
					};
				}
			}

			const newFilterMapContent = await dcartDataSource
				.getRepository(FilterMapContent)
				.create({
					...filterMapContentToUpdate,
					options: req.body,
				});

			await dcartDataSource
				.getRepository(FilterMapContent)
				.save(newFilterMapContent);

			res.status(201).json({ message: "Option ajoutée à la carte" });
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

			const newFilters: Filter[] = [];
			for (const filter in req.body) {
				if (req.body[filter]) {
					// si le filtre est coché
					const filterToAdd = await dcartDataSource
						.getRepository(Filter)
						.findOne({
							where: { type: filter as string },
							relations: ["filterMapContent"],
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

			const existingFilters = await dcartDataSource
				.getRepository(FilterMapContent)
				.createQueryBuilder("filterMapContent")
				.leftJoinAndSelect("filterMapContent.filter", "filter")
				.where("filterMapContent.mapId = :mapId", { mapId: map.id })
				.getMany();

			// on supprime les filtres de la carte
			const filtersToDelete = existingFilters.filter(
				(filter) =>
					!newFilters.find((f) => {
						return f.id === filter.filter?.id;
					}),
			);

			Promise.all(
				filtersToDelete.map(async (filter: FilterMapContent) => {
					await dcartDataSource
						.getRepository(FilterMapContent)
						.delete(filter.id);
				}),
			);

			// on ajoute les filtres à la carte (s'ils n'existent pas déjà)
			const filtersToAdd = newFilters.filter(
				(filter) =>
					!existingFilters.find((f) => {
						return f.filter?.id === filter.id;
					}),
			);
			Promise.all(
				filtersToAdd.map(async (filter: Filter) => {
					await dcartDataSource.getRepository(FilterMapContent).save({
						filter: filter,
						map: map,
						options: filter.type === "element" ? { solution: "basic" } : null,
					});
				}),
			);

			res.status(200).json({ message: "Nouveaux filtres ajoutés à la carte" });
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
