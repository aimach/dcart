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
			<img src={imgSrc} alt={imgAlt} width={imgWidth} />
		</Link>
	) : (
		<a href={link}>
			<button type="button" aria-label={ariaLabel} className={buttonClassName}>
				<img src={imgSrc} alt={imgAlt} width={imgWidth} />
			</button>
		</a>
	);
};

export default ImageWithLink;
