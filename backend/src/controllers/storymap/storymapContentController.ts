// import des types
import type { Request, Response } from "express";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { Storymap } from "../../entities/storymap/Storymap";
import { groupByLocation } from "../../utils/functions/storymap";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Point } from "../../entities/storymap/Point";
import type {
	BlockInterface,
	GroupedPoint,
} from "../../utils/types/storymapTypes";

export const storymapContentControllers = {
	// récupère une storymap par son id
	getStorymapById: async (req: Request, res: Response): Promise<void> => {
		try {
			const storymapInfos = await dcartDataSource
				.getRepository(Storymap)
				.createQueryBuilder("storymap")
				.leftJoinAndSelect("storymap.category", "category")
				.leftJoinAndSelect("storymap.blocks", "block")
				.leftJoinAndSelect("block.points", "point")
				.leftJoinAndSelect("block.type", "type")
				.leftJoinAndSelect("block.children", "child")
				.leftJoinAndSelect("child.type", "child_type")
				.leftJoinAndSelect("child.points", "step_point")
				.where("storymap.id = :id", { id: req.params.id })
				.orderBy("block.position", "ASC")
				.getOne();

			if (!storymapInfos) {
				res.status(404).send({ message: "Storymap not found" });
				return;
			}

			if (storymapInfos?.blocks?.length) {
				// on filtre les blocks pour enlever ceux qui n'ont pas de position ou qui sont de type "step"
				storymapInfos.blocks = storymapInfos.blocks.filter(
					(block) => block.position !== null && block.type?.name !== "step",
				);

				storymapInfos?.blocks.map((block) => {
					// s'il y a des points au niveau d'un block, on les regroupes par localisation
					if (block.points.length) {
						const groupedPoints: GroupedPoint[] = groupByLocation(
							block.points as Point[],
						);
						(block as BlockInterface).groupedPoints = groupedPoints;
					}

					// s'il y a des points au niveau des enfants, on fait de même
					if (block.children.length) {
						block.children.map((child) => {
							const groupedPoints: GroupedPoint[] = groupByLocation(
								child.points as Point[],
							);
							(child as BlockInterface).groupedPoints = groupedPoints;
						});
					}
				});
			}

			res.status(200).send(storymapInfos);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// crée une nouvelle storymap
	createNewStorymap: async (req: Request, res: Response): Promise<void> => {
		console.log(req.body);
		try {
			const newStorymap = dcartDataSource.getRepository(Storymap).create({
				...req.body,
				category: req.body.category_id,
			});
			await dcartDataSource.getRepository(Storymap).save(newStorymap);
			res.status(201).send(newStorymap);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// met à jour une storymap
	updateStorymap: async (req: Request, res: Response): Promise<void> => {
		try {
			const { storymapId } = req.params;

			const storymapToUpdate = await dcartDataSource
				.getRepository(Storymap)
				.findOne({
					where: { id: storymapId },
				});

			if (!storymapToUpdate) {
				res.status(404).send("Storymap non trouvée.");
				return;
			}

			const updatedStorymap = await dcartDataSource
				.getRepository(Storymap)
				.create({
					...storymapToUpdate,
					...req.body,
					category: req.body.category_id,
				});

			const newStorymap = await dcartDataSource
				.getRepository(Storymap)
				.save(updatedStorymap);

			res.status(200).send(newStorymap);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
