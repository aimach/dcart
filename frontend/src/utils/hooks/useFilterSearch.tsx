// import des bibliothèques
import { useState, useMemo, useCallback } from "react";
// import des services
import { useMapStore } from "../stores/builtMap/mapStore";
import { getAllPointsByMapId } from "../api/builtMap/getRequests";
// import des types
import type { UserFilterType } from "../types/filterTypes";

const useFilterSearch = () => {
	const [lastUserFilters, setLastUserFilters] = useState<UserFilterType | null>(
		null,
	);
	const { allPoints, setAllPoints, setAllResults } = useMapStore();

	// Fonction pour récupérer les données avec un cache (useMemo)
	const fetchFilteredPoints = useCallback(
		async (mapId: string, filters: UserFilterType) => {
			// si les filtres sont identiques, ne rien faire
			if (JSON.stringify(filters) === JSON.stringify(lastUserFilters)) {
				return;
			}

			const allPoints = await getAllPointsByMapId(mapId, filters);
			setAllPoints(allPoints);
			setAllResults(allPoints);
			setLastUserFilters(filters);
		},
		[lastUserFilters],
	);

	// Résultats en cache grâce à useMemo (évite recalculs inutiles)
	const cachedPoints = useMemo(() => {
		return lastUserFilters ? allPoints : null;
	}, [lastUserFilters]);

	return { fetchFilteredPoints, cachedPoints };
};

export default useFilterSearch;
