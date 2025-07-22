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

const displayBrushCleaningButton = (
	idToClean: string,
	isDisabled: boolean,
	setPointSetIdToClean: (id: string) => void,
	setIsModalOpen: (isOpen: boolean) => void,
	setPointType?: (type: "bdd" | "custom") => void,
	pointType?: "bdd" | "custom",
) =>
	isDisabled ? (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="#a1afc4"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-brush-cleaning-icon lucide-brush-cleaning"
			role="img"
			aria-label="Brush Cleaning Icon"
			cursor={"not-allowed"}
		>
			<path d="m16 22-1-4" />
			<path d="M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1" />
			<path d="M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z" />
			<path d="m8 22 1-4" />
		</svg>
	) : (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-brush-cleaning-icon lucide-brush-cleaning"
			role="img"
			aria-label="Brush Cleaning Icon"
			cursor={"pointer"}
			onClick={() => {
				setPointSetIdToClean(idToClean as string);
				setIsModalOpen(true);
				setPointType?.(pointType ? pointType : "bdd");
			}}
			onKeyDown={() => {
				setPointSetIdToClean(idToClean as string);
				setIsModalOpen(true);
				setPointType?.(pointType ? pointType : "bdd");
			}}
		>
			<path d="m16 22-1-4" />
			<path d="M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1" />
			<path d="M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z" />
			<path d="m8 22 1-4" />
		</svg>
	);

export { shuffleArray, displayBrushCleaningButton };
