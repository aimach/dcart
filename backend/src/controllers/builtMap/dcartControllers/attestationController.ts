// import des entités
import { Attestation } from "../../../entities/builtMap/Attestation";
// import des services
import { dcartDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";
import { MapContent } from "../../../entities/builtMap/MapContent";
import { Icon } from "../../../entities/builtMap/Icon";

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
			const { icon, mapId } = req.body;

			const mapToAddAttestations = await dcartDataSource
				.getRepository(MapContent)
				.findOne({ where: { id: mapId } });

			if (!mapToAddAttestations) {
				res.status(404).json("La carte n'existe pas");
				return;
			}

			const iconToAdd = await dcartDataSource
				.getRepository(Icon)
				.findOne({ where: { id: icon } });

			if (!iconToAdd) {
				res.status(404).json("L'icône n'existe pas");
				return;
			}

			const newAttestation = await dcartDataSource
				.getRepository(Attestation)
				.save({ ...req.body, icon: iconToAdd, map: mapToAddAttestations });
			res.status(201).json(newAttestation);
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
				.findOne({ where: { id } });

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
