// import des entités
import { Attestation } from "../../entities/common/Attestation";
import { MapContent } from "../../entities/builtMap/MapContent";
import { Icon } from "../../entities/common/Icon";
import { Color } from "../../entities/common/Color";
import { Block } from "../../entities/storymap/Block";
import { Point } from "../../entities";
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
					icon: iconToAdd,
					[mapId ? "map" : "block"]: parentToAddAttestations,
					color: colorToAdd,
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

			res.status(200).json("Le jeu d'attestations a bien été modifié");
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
				.findOneBy({ id });

			if (!attestationListToDelete) {
				res.status(404).json("Le jeu d'attestations n'existe pas");
				return;
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
