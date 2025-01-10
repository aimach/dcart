interface ImageWithButtonProps {
	link: string;
	ariaLabel: string;
	buttonClassName: string;
	imgSrc: string;
	imgAlt: string;
	imgWidth: number;
}

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
				<img src={imgSrc} alt={imgAlt} width={imgWidth} />
			</button>
		</a>
	);
};

export default ImageWithButton;
