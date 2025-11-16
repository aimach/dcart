// import des bibiliothèques
import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";
// import des services
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import "quill/dist/quill.snow.css";
import style from "./tableBlock.module.scss";

interface TableBlockProps {
  blockContent: BlockContentType;
}

const TableBlock = ({ blockContent }: TableBlockProps) => {
  // récupération des données des stores
  const { selectedLanguage } = useStorymapLanguageStore();

  // au montage du tableau, transformation de la chaîne de caractère en variable manipulable
  const [tableContent, setTableContent] = useState<string[][]>([]);
  useEffect(() => {
    const content = blockContent[`content2_${selectedLanguage}`];
    try {
      if (content) {
        setTableContent(JSON.parse(content));
      }
    } catch (error) {
      console.error("Erreur de parsing JSON:", error);
    }
  }, [blockContent, selectedLanguage]);

  const sanitizedCaption = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content1_${selectedLanguage}`] || ""
    );
  }, [blockContent, selectedLanguage]);

  return (
    <section className={style.tableSection}>
      <table
        className={`${style.tableBlock} ${
          style[`tableBlock${blockContent.content3}`]
        }`}
      >
        <tbody>
          {tableContent.map((row, rowIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey:
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey:
                <td
                  key={colIndex}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cell) }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
        dangerouslySetInnerHTML={{ __html: sanitizedCaption }}
      />
    </section>
  );
};

export default TableBlock;
