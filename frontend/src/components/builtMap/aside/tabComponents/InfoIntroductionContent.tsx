// import des composants
import ButtonComponent from "../../../common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { getTranslations } from "../../../../utils/api/translationAPI";
// import du style
import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";
import style from "./tabComponent.module.scss";

type InfoIntroductionContentProps = {
  setIsIntroDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
};

const InfoIntroductionContent = ({
  setIsIntroDisplayed,
}: InfoIntroductionContentProps) => {
  const { translation, language } = useTranslation();

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      sessionStorage.setItem("showIntro", "false");
    } else {
      sessionStorage.setItem("showIntro", "true");
    }
  };

  const [textContent, setTextContent] = useState<string>("");
  useEffect(() => {
    const fetchDatabaseTranslation = async () => {
      const intro = await getTranslations("mapPage.introContent");
      setTextContent(intro[language]);
    };
    fetchDatabaseTranslation();
  }, [language]);

  const sanitizedTextContent = useMemo(() => {
    return DOMPurify.sanitize(textContent || "");
  }, [textContent]);

  return (
    <div className={style.introContentContainer}>
      <p
        // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
        dangerouslySetInnerHTML={{ __html: sanitizedTextContent }}
        className="ql-editor"
      />
      <div className={style.checkboxContainer}>
        <input type="checkbox" id="showIntro" onChange={handleCheckbox} />
        <label htmlFor="showIntro">
          {translation[language].mapPage.aside.dontShowAgain}
        </label>
      </div>
      <ButtonComponent
        type="button"
        textContent={translation[language].common.next}
        color="brown"
        onClickFunction={() => setIsIntroDisplayed(false)}
      />
    </div>
  );
};

export default InfoIntroductionContent;
