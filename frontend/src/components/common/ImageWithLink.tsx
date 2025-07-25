// import des bibliothèques
import { Link } from "react-router";

interface ImageWithLinkProps {
	type: "link" | "route";
	link: string;
	ariaLabel?: string;
	buttonClassName?: string;
	imgSrc: string;
	imgAlt: string;
	imgWidth: number;
}

/**
 * Composant ImageWithLink
 * @param {string} type - le type de lien
 * @param {string} link - le lien
 * @param {string} ariaLabel - le texte alternatif pour l'accessibilité
 * @param {string} buttonClassName - la classe CSS du bouton
 * @param {string} imgSrc - la source de l'image
 * @param {string} imgAlt - le texte alternatif de l'image
 * @param {number} imgWidth - la largeur de l'image
 */
const ImageWithLink = ({
	type,
	link,
	ariaLabel,
	buttonClassName,
	imgSrc,
	imgAlt,
	imgWidth,
}: ImageWithLinkProps) => {
	return type === "route" ? (
		<Link to={link}>
			<img
				src={imgSrc}
				alt={imgAlt}
				width={imgWidth}
				height="auto"
				loading="lazy"
			/>
		</Link>
	) : (
		<a href={link} target="_blank" rel="noopener noreferrer">
			<button
				type="button"
				aria-label={ariaLabel}
				className={buttonClassName}
				style={{ cursor: "pointer" }}
			>
				<img
					src={imgSrc}
					alt={imgAlt}
					width={imgWidth}
					height="auto"
					loading="lazy"
				/>
			</button>
		</a>
	);
};

export default ImageWithLink;
