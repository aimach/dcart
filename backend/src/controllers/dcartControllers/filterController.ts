// import des entités
import { Filter } from "../../entities/Filter";
import { MapContent } from "../../entities/MapContent";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";
import type { FilterType } from "../../entities/Filter";

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
			map.filters = newFilters;
			await dcartDataSource.getRepository(MapContent).save(map);

			res.status(201).json({ message: "Filtres ajoutés à la carte" });
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
