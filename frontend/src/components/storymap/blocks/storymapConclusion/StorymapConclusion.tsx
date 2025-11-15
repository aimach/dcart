// import des bibliothèques
import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";
// import des composants
import SwiperContainer from "../../../common/swiper/SwiperContainer";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { allStorymapsFromTag } from "../../../../utils/api/storymap/getRequests";
// import des types
import type { TagType } from "../../../../utils/types/mapTypes";
import type { StorymapType } from "../../../../utils/types/storymapTypes";
// import du style
import SeparatorBlock from "../separatorBlock/SeparatorBlock";
import style from "./storymapConclusion.module.scss";

interface StorymapConclusionProps {
  storymapInfos: StorymapType;
}

const StorymapConclusion = ({ storymapInfos }: StorymapConclusionProps) => {
  const { translation, language } = useTranslation();
  const [otherStorymaps, setOtherStorymaps] = useState<StorymapType[]>([]);

  const sanitizedAuthor = useMemo(() => {
    return storymapInfos.author
      ? DOMPurify.sanitize(storymapInfos.author)
      : null;
  }, [storymapInfos.author]);

  const sanitizedAuthorStatus = useMemo(() => {
    return storymapInfos.author_status
      ? DOMPurify.sanitize(storymapInfos.author_status)
      : null;
  }, [storymapInfos.author_status]);

  const sanitizedAuthorEmail = useMemo(() => {
    return storymapInfos.author_email
      ? DOMPurify.sanitize(storymapInfos.author_email)
      : null;
  }, [storymapInfos.author_email]);

  useEffect(() => {
    if (storymapInfos.tags?.length === 0) {
      return;
    }

    const getAnotherStorymaps = async () => {
      const results = await Promise.all(
        (storymapInfos.tags as TagType[]).map(async (tag) => {
          return await allStorymapsFromTag(tag.id);
        })
      );
      const filteredResults = results
        .flat()
        .filter(
          (storymap) => storymap.isActive && storymap.id !== storymapInfos.id
        );
      setOtherStorymaps(filteredResults);
    };
    getAnotherStorymaps();
  }, [storymapInfos.tags, storymapInfos.id]);

  return (
    <>
      <SeparatorBlock />
      <section className={style.conclusionContainer}>
        <div>
          {sanitizedAuthor && (
            <p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
              dangerouslySetInnerHTML={{ __html: sanitizedAuthor }}
            />
          )}
          {sanitizedAuthorStatus && (
            <p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
              dangerouslySetInnerHTML={{ __html: sanitizedAuthorStatus }}
            />
          )}
          {sanitizedAuthorEmail && (
            <p>
              <a href={`mailto:${storymapInfos.author_email}`}>
                <span // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
                  dangerouslySetInnerHTML={{ __html: sanitizedAuthorEmail }}
                />
              </a>
            </p>
          )}
        </div>
        {otherStorymaps.length > 0 && (
          <div>
            <h4>{translation[language].seeAlso.toUpperCase()}</h4>
            <div className={style.storymapContainer}>
              <SwiperContainer items={otherStorymaps} />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default StorymapConclusion;
