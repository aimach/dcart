// import du style
import style from "./titleAndTextComponent.module.scss";
// import des images
import delta from "../../../assets/delta.png";

interface TitleAndTextComponentProps {
  title: string;
  text: string;
  textAsHtml?: string;
}
/**
 * Affichage un titre h3 entouré d'images de décoration et une description
 * @param {string} title le titre h3
 * @param {string} text la description
 * @param {string} textAsHtml la description formatée en HTML (optionnel)
 * @returns
 */
const TitleAndTextComponent = ({
  title,
  text,
  textAsHtml,
}: TitleAndTextComponentProps) => {
  return (
    <section className={style.titleAndTextContainer}>
      <div className={style.titleSection}>
        <img
          src={delta}
          alt="decoration"
          width={50}
          height="auto"
          loading="lazy"
        />
        <h1>{title}</h1>
        <img
          src={delta}
          alt="decoration"
          width={50}
          height="auto"
          loading="lazy"
        />
      </div>
      {textAsHtml ? (
        <p
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
          dangerouslySetInnerHTML={{ __html: textAsHtml }}
        />
      ) : (
        <p>{text}</p>
      )}
    </section>
  );
};

export default TitleAndTextComponent;
