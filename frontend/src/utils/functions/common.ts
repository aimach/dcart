/**
 * Fonction pour mélanger les éléments d'un tableau (méthode Fisher-Yates)
 * @param array - Le tableau à mélanger
 * @returns - Le tableau mélangé
 */

// biome-ignore lint/suspicious/noExplicitAny: cette fonction est générique et peut être utilisée avec n'importe quel type de tableau
const shuffleArray = (array: any[]) => {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

export { shuffleArray };
