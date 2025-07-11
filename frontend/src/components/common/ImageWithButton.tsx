interface ImageWithButtonProps {
	link: string;
	ariaLabel: string;
	buttonClassName: string;
	imgSrc: string;
	imgAlt: string;
	imgWidth: number;
}

/**
 * Composant contenant une image entourée d'un bouton
 * @param {Object} props Les props du composant
 * @param {string} props.link Le lien de redirection
 * @param {string} props.ariaLabel Le texte alternatif de l'image
 * @param {string} props.buttonClassName La classe CSS du bouton
 * @param {string} props.imgSrc L'URL de l'image
 * @param {string} props.imgAlt Le texte alternatif de l'image
 * @param {number} props.imgWidth La largeur de l'image
 * @returns
 */
const ImageWithButton = ({
	link,
	ariaLabel,
	buttonClassName,
	imgSrc,
	imgAlt,
	imgWidth,
}: ImageWithButtonProps) => {
	return (
		<a href={link}>
			<button type="button" aria-label={ariaLabel} className={buttonClassName}>
				<img src={imgSrc} alt={imgAlt} width={imgWidth} loading="lazy" />
			</button>
		</a>
	);
};

export default ImageWithButton;
