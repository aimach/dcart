// import des entités
import { Attestation } from "../../entities/common/Attestation";
import { MapContent } from "../../entities/builtMap/MapContent";
import { Icon } from "../../entities/common/Icon";
import { Color } from "../../entities/common/Color";
import { Block } from "../../entities/storymap/Block";
import { User } from "../../entities/auth/User";
import { Point, Storymap } from "../../entities";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";
import type { CustomPointType } from "../../utils/types/mapTypes";

export const attestationController = {
	// récupère toutes les attestations d'une carte
	getAttestationsByMapId: async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			const { mapId } = req.params;

			let results = null;

			results = await dcartDataSource
				.getRepository(Attestation)
				.findOneBy({ id: mapId });

			if (!results) {
				res.status(404).json("Aucune attestation pour cette carte");
			}

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// créer une liste d'attestation
	createAttestationList: async (req: Request, res: Response): Promise<void> => {
		try {
			const { color, icon, mapId, blockId, customPointsArray } = req.body;

			const parentRepository = mapId
				? dcartDataSource.getRepository(MapContent)
				: dcartDataSource.getRepository(Block);
			const parentId = mapId ? mapId : blockId;

			if (!parentId) {
				res.status(400).json("L'id de la carte ou du bloc est requis");
				return;
			}
			const parentToAddAttestations = await parentRepository.findOne({
				where: { id: parentId },
			});
			if (!parentToAddAttestations) {
				res.status(404).json("La carte ou le bloc n'existe pas");
				return;
			}

			let iconToAdd = null;
			if (!icon) {
				iconToAdd = await dcartDataSource
					.getRepository(Icon)
					.findOne({ where: { name_fr: "cercle" } });
			} else {
				iconToAdd = await dcartDataSource
					.getRepository(Icon)
					.findOne({ where: { id: icon } });
			}

			if (!iconToAdd) {
				res.status(404).json("L'icône n'existe pas");
				return;
			}

			let colorToAdd = null;
			if (!color) {
				colorToAdd = await dcartDataSource
					.getRepository(Color)
					.findOne({ where: { name_fr: "marron" } });
			} else {
				colorToAdd = await dcartDataSource
					.getRepository(Color)
					.findOne({ where: { id: req.body.color } });
			}

			if (!colorToAdd) {
				res.status(404).json("La couleur n'existe pas");
				return;
			}

			const newAttestation = await dcartDataSource
				.getRepository(Attestation)
				.save({
					...req.body,
					attestationIds: req.body.attestationIds || "",
					icon: iconToAdd,
					[mapId ? "map" : "block"]: parentToAddAttestations,
					color: colorToAdd,
					lastActivity: new Date(),
				});

			if (customPointsArray && customPointsArray.length > 0) {
				const pointRepository = dcartDataSource.getRepository(Point);

				Promise.all(
					customPointsArray.map(async (pointData: CustomPointType) => {
						const newPoint = pointRepository.create({
							...pointData,
							attestation: newAttestation,
						});
						return pointRepository.save(newPoint);
					}),
				);
			}

			if (mapId) {
				const user = await dcartDataSource
					.getRepository(User)
					.findOneBy({ id: req.user?.userId || "" });

				// mise à jour de la date de modification de la carte
				await dcartDataSource.getRepository(MapContent).update(mapId, {
					updatedAt: new Date(),
					modifier: user || null,
				});
			}

			res.status(201).json(newAttestation);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// modifier une liste d'attestation
	modifyAttestationList: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;
			const { color, icon, mapId, blockId, customPointsArray } = req.body;

			const parentRepository = mapId
				? dcartDataSource.getRepository(MapContent)
				: dcartDataSource.getRepository(Block);
			const parentId = mapId ? mapId : blockId;

			if (!parentId) {
				res.status(400).json("L'id de la carte ou du bloc est requis");
				return;
			}
			const parentToAddAttestations = await parentRepository.findOne({
				where: { id: parentId },
			});
			if (!parentToAddAttestations) {
				res.status(404).json("La carte ou le bloc n'existe pas");
				return;
			}

			let iconToAdd = null;
			if (!icon) {
				iconToAdd = await dcartDataSource
					.getRepository(Icon)
					.findOne({ where: { name_fr: "cercle" } });
			} else {
				iconToAdd = await dcartDataSource
					.getRepository(Icon)
					.findOne({ where: { id: icon } });
			}

			if (!iconToAdd) {
				res.status(404).json("L'icône n'existe pas");
				return;
			}

			let colorToAdd = null;
			if (!color) {
				colorToAdd = await dcartDataSource
					.getRepository(Color)
					.findOne({ where: { name_fr: "marron" } });
			} else {
				colorToAdd = await dcartDataSource
					.getRepository(Color)
					.findOne({ where: { id: req.body.color } });
			}

			if (!colorToAdd) {
				res.status(404).json("La couleur n'existe pas");
				return;
			}

			const attestationListToUpdate = await dcartDataSource
				.getRepository(Attestation)
				.findOneBy({ id });
			if (!attestationListToUpdate) {
				res.status(404).json("Le jeu d'attestations n'existe pas");
				return;
			}

			attestationListToUpdate.icon = iconToAdd;
			attestationListToUpdate.color = colorToAdd;
			attestationListToUpdate.name_fr = req.body.name_fr;
			attestationListToUpdate.name_en = req.body.name_en;
			attestationListToUpdate.attestationIds = req.body.attestationIds;
			attestationListToUpdate.lastActivity = new Date();

			const updatedAttestation = await dcartDataSource
				.getRepository(Attestation)
				.save(attestationListToUpdate);

			if (customPointsArray && customPointsArray.length > 0) {
				const pointRepository = dcartDataSource.getRepository(Point);

				// Supprimer les points existants liés à cette attestation
				await pointRepository.delete({ attestation: updatedAttestation });

				Promise.all(
					customPointsArray.map(async (pointData: CustomPointType) => {
						const newPoint = pointRepository.create({
							...pointData,
							attestation: updatedAttestation,
						});
						return pointRepository.save(newPoint);
					}),
				);
			}

			if (mapId) {
				const user = await dcartDataSource
					.getRepository(User)
					.findOneBy({ id: req.user?.userId || "" });

				// mise à jour de la date de modification de la carte
				await dcartDataSource.getRepository(MapContent).update(mapId, {
					updatedAt: new Date(),
					modifier: user || null,
				});
			}

			res.status(200).json("Le jeu d'attestations a bien été modifié");
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	cleanAttestationList: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;
			const { mapType, pointType } = req.query;

			const attestationListToUpdate = await dcartDataSource
				.getRepository(Attestation)
				.findOne({ where: { id }, relations: ["map", "block"] });
			if (!attestationListToUpdate) {
				res.status(404).json("Le jeu d'attestations n'existe pas");
				return;
			}

			// vider le champ attestationIds
			if (pointType === "bdd") {
				attestationListToUpdate.attestationIds = "";
				await dcartDataSource
					.getRepository(Attestation)
					.save(attestationListToUpdate);

				// mise à jour de la date de dernière activité de la carte préconstruite
				if (mapType === "map") {
					await dcartDataSource
						.getRepository(MapContent)
						.update(attestationListToUpdate.map?.id as string, {
							updatedAt: new Date(),
						});
				}
			}

			// supprimer tous les points associés
			if (pointType === "custom") {
				await dcartDataSource
					.getRepository(Point)
					.delete({ attestation: attestationListToUpdate });
			}

			if (mapType === "storymap") {
				const blockToUpdate = await dcartDataSource
					.getRepository(Block)
					.findOne({
						where: { id: attestationListToUpdate.block?.id },
						relations: { storymap: true },
					});

				// mise à jour de la date de dernière activité
				await dcartDataSource
					.getRepository(Storymap)
					.update(blockToUpdate?.storymap.id as string, {
						updatedAt: new Date(),
					});
			}

			res
				.status(200)
				.json("Le jeu d'attestations a bien été vidé de ses points");
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// supprimer un jeu d'attestations
	deleteAttestationList: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			const attestationListToDelete = await dcartDataSource
				.getRepository(Attestation)
				.findOne({
					where: { id },
					relations: {
						map: true,
						block: true,
					},
				});

			if (!attestationListToDelete) {
				res.status(404).json("Le jeu d'attestations n'existe pas");
				return;
			}

			if (attestationListToDelete.map) {
				const user = await dcartDataSource
					.getRepository(User)
					.findOneBy({ id: req.user?.userId || "" });

				// mise à jour de la date de modification de la carte
				await dcartDataSource
					.getRepository(MapContent)
					.update(attestationListToDelete.map.id, {
						updatedAt: new Date(),
						modifier: user || null,
					});
			}

			if (attestationListToDelete.block) {
				const user = await dcartDataSource
					.getRepository(User)
					.findOneBy({ id: req.user?.userId || "" });

				// mise à jour de la date de modification du bloc et de la storymap
				const blockRepository = dcartDataSource.getRepository(Block);
				const blockToUpdate = await blockRepository.findOne({
					where: { id: attestationListToDelete.block.id },
					relations: { storymap: true },
				});

				await blockRepository.update(attestationListToDelete.block.id, {
					updatedAt: new Date(),
				});

				await dcartDataSource
					.getRepository(Storymap)
					.update(blockToUpdate?.storymap.id as string, {
						updatedAt: new Date(),
						modifier: user || null,
					});
			}

			await dcartDataSource
				.getRepository(Attestation)
				.remove(attestationListToDelete);
			res.status(200).json("Le jeu d'attestations a bien été supprimé");
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
