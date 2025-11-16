// import de bibliothèques
import DOMPurify from "dompurify";
import { useMemo, useState } from "react";
// import des composants
import MapSection from "./MapSection";
import ScrolledSection from "./ScrolledSection";
// import des services
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./scrolledMapBlock.module.scss";

interface SimpleMapBlockProps {
  blockContent: BlockContentType;
  mapName: string;
}

const ScrolledMapBlock = ({ blockContent, mapName }: SimpleMapBlockProps) => {
  const { selectedLanguage } = useStorymapLanguageStore();
  const [currentPoint, setCurrentPoint] = useState("");
  const onStepEnter = ({ data }: { data: string }) => {
    const pointId = data.split("|")[0];
    setCurrentPoint(pointId);
  };

  const reversedChildren = [
    ...(blockContent.children as BlockContentType[]),
  ].reverse();

  const sanitizedTitle = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content1_${selectedLanguage}`] || ""
    );
  }, [blockContent, selectedLanguage]);

  return (
    <>
      <div className={style.mapContainer}>
        <MapSection
          blockContent={blockContent}
          mapName={mapName}
          currentPoint={currentPoint}
          setCurrentPoint={setCurrentPoint}
        />
        <div className={style.scrolledSection}>
          <ScrolledSection
            onStepEnter={onStepEnter}
            steps={reversedChildren}
            currentPoint={currentPoint}
          />
        </div>
      </div>
      <h4 className={style.mapTitle}>
        <span
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
          dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
        />
      </h4>
    </>
  );
};

export default ScrolledMapBlock;
