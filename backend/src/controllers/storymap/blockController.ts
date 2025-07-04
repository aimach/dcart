// import des entités
import { Block } from "../../entities/storymap/Block";
import { Storymap } from "../../entities/storymap/Storymap";
import { Type } from "../../entities/storymap/Type";
import { User } from "../../entities/auth/User";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const blockController = {
	// récupère tous les blocs ou un bloc en particulier
	getBlockInfos: async (req: Request, res: Response): Promise<void> => {
		try {
			const { blockId } = req.params;
			if (!blockId) {
				res.status(400).send("Aucun identifiant de block reçu.");
				return;
			}

			if (blockId === "all") {
				const blocks = await dcartDataSource.getRepository(Block).find();

				res.status(200).send(blocks);
				return;
			}

			const block = await dcartDataSource
				.getRepository(Block)
				.createQueryBuilder("block")
				.leftJoinAndSelect("block.children", "blocks")
				.leftJoinAndSelect("block.type", "type")
				.leftJoinAndSelect("blocks.type", "childrenType")
				.leftJoinAndSelect("block.attestations", "attestations")
				.leftJoinAndSelect("attestations.icon", "icon")
				.leftJoinAndSelect("attestations.color", "color")
				.leftJoinAndSelect(
					"attestations.customPointsArray",
					"customPointsArray",
				)
				.leftJoinAndSelect("blocks.attestations", "childrenAttestations")
				.leftJoinAndSelect("childrenAttestations.icon", "childrenIcon")
				.leftJoinAndSelect("childrenAttestations.color", "childrenColor")
				.leftJoinAndSelect(
					"childrenAttestations.customPointsArray",
					"childrenCustomPointsArray",
				)
				.orderBy("blocks.position", "ASC")
				.where("block.id = :blockId", { blockId })
				.getOne();

			if (!block) {
				res.status(404).send("Block non trouvé.");
				return;
			}

			res.status(200).send(block);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// crée un nouveau bloc
	createNewBlock: async (req: Request, res: Response): Promise<void> => {
		try {
			const {
				content1_lang1,
				content1_lang2,
				content2_lang1,
				content2_lang2,
				content3,
				parentId,
				storymapId,
				typeName,
			} = req.body;

			// on vérifie que la storymap existe
			const storymap = await dcartDataSource.getRepository(Storymap).findOne({
				where: { id: storymapId },
			});

			if (!storymap) {
				res.status(404).send("Storymap non trouvée.");
				return;
			}

			// on récupère l'id du type
			const blockType = await dcartDataSource.getRepository(Type).findOne({
				where: { name: typeName },
			});

			if (!blockType) {
				res.status(404).send("Type de block non trouvé.");
				return;
			}

			// on récupère le nombre de blocks pour déterminer la position
			const query = dcartDataSource.createQueryBuilder(Block, "block");
			query
				.select("MAX(block.position)", "max")
				.where("block.storymap = :storymapId", { storymapId });
			const position = await query.getRawOne();

			const isLayoutChild =
				(blockType.name === "image" || blockType.name === "text") && parentId;

			const newBlock = dcartDataSource.getRepository(Block).create({
				content1_lang1,
				content1_lang2,
				content2_lang1,
				content2_lang2,
				content3: content3 || null,
				position: isLayoutChild ? null : position.max + 1,
				parent: parentId,
				storymap: storymapId,
				type: blockType,
			});

			await dcartDataSource.getRepository(Block).save(newBlock);

			// mise à jour de la date de modification de la storymap

			const user = await dcartDataSource.getRepository(User).findOneBy({
				id: req.user?.userId || "",
			});
			await dcartDataSource.getRepository(Storymap).update(storymapId, {
				updatedAt: new Date(),
				modifier: user || null,
			});

			res.status(201).send(newBlock);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// met à jour un bloc
	updateBlock: async (req: Request, res: Response): Promise<void> => {
		try {
			const { blockId } = req.params;

			if (blockId === "position") {
				const { blocks } = req.body;

				if (!blocks || blocks.length === 0) {
					res.status(400).send("Aucune donnée reçue");
					return;
				}

				for (const [index, block] of blocks.entries()) {
					dcartDataSource.getRepository(Block).update(
						{ id: block.id },
						{
							position: index + 1,
						},
					);
				}

				res.status(200).send("Position des blocs mise à jour.");
				return;
			}

			const blockToUpdate = await dcartDataSource.getRepository(Block).findOne({
				where: { id: blockId },
				relations: {
					storymap: true,
				},
			});

			if (!blockToUpdate) {
				res.status(404).send("Block non trouvé.");
				return;
			}

			const {
				content1_lang1,
				content1_lang2,
				content2_lang1,
				content2_lang2,
				content3,
				parentId,
			} = req.body;

			const updatedBlock = await dcartDataSource.getRepository(Block).create({
				...blockToUpdate,
				content1_lang1,
				content1_lang2,
				content2_lang1,
				content2_lang2,
				content3,
				parent: parentId,
			});

			const newBlock = await dcartDataSource
				.getRepository(Block)
				.save(updatedBlock);

			const savedBlock = await dcartDataSource.getRepository(Block).findOne({
				where: { id: newBlock.id },
				relations: {
					attestations: {
						icon: true,
						color: true,
					},
				},
			});

			const user = await dcartDataSource.getRepository(User).findOneBy({
				id: req.user?.userId || "",
			});
			// mise à jour de la date de modification de la storymap
			await dcartDataSource
				.getRepository(Storymap)
				.update(updatedBlock.storymap.id, {
					updatedAt: new Date(),
					modifier: user || null,
				});

			res.status(200).send(savedBlock);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// supprime un bloc
	deleteBlock: async (req: Request, res: Response): Promise<void> => {
		try {
			const { blockId } = req.params;

			const blockToDelete = await dcartDataSource.getRepository(Block).findOne({
				where: { id: blockId },
			});

			if (!blockToDelete) {
				res.status(404).send("Bloc non trouvé.");
				return;
			}

			await dcartDataSource.getRepository(Block).delete(blockId);

			res.status(200).send("Block supprimé.");
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
