// import des bibiliothèques
import { useEffect, useState } from "react";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./tableBlock.module.scss";
import "quill/dist/quill.snow.css";

interface TableBlockProps {
	blockContent: BlockContentType;
}

const TableBlock = ({ blockContent }: TableBlockProps) => {
	// récupération des données de traduction
	const { language } = useTranslation();

	// au montage du tableau, transformation de la chaîne de caractère en variable manipulable
	const [tableContent, setTableContent] = useState<string[][]>([]);
	useEffect(() => {
		const content = blockContent[`content2_${language}`];
		try {
			if (content) {
				setTableContent(JSON.parse(content));
			}
		} catch (error) {
			console.error("Erreur de parsing JSON:", error);
		}
	}, [blockContent, language]);

	return (
		<section className={style.tableSection}>
			<table className={style.tableBlock}>
				<tbody>
					{tableContent.map((row, rowIndex) => (
						// biome-ignore lint/suspicious/noArrayIndexKey:
						<tr key={rowIndex}>
							{row.map((cell, colIndex) => (
								// biome-ignore lint/suspicious/noArrayIndexKey:
								<td key={colIndex}>{cell}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<p>{blockContent[`content1_${language}`]}</p>
		</section>
	);
};

export default TableBlock;
