// import des types
import type { Point } from "../../entities/storymap/Point";
import type { GroupedPoint } from "../types/storymapTypes";

/**
 * Fonction qui regroupe les points par localisation (latitude et longitude)
 * @param {Point[]} points - Liste des points à regrouper
 * @returns {GroupedPoint[]} Liste des points regroupés
 */
const groupByLocation = (points: Point[]): GroupedPoint[] => {
	const groupedPoints: GroupedPoint[] = [];
	for (const point of points) {
		const locationAlreadyExistsInArray = (groupedPoint: GroupedPoint) =>
			groupedPoint.latitude === point.latitude &&
			groupedPoint.longitude === point.longitude;
		const foundLocation = groupedPoints.find(
			locationAlreadyExistsInArray,
			point,
		);
		if (!foundLocation) {
			const groupedPoint = {
				latitude: point.latitude,
				longitude: point.longitude,
				pane: point.pane,
				attestations: [point],
				color: point.color,
			};
			groupedPoints.push(groupedPoint);
		} else {
			foundLocation.attestations?.push(point);
		}
	}
	return groupedPoints;
};

export { groupByLocation };
