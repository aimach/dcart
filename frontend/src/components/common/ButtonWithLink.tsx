interface ButtonWithLinkProps {
	link: string;
	ariaLabel: string;
	buttonClassName: string;
	imgSrc: string;
	imgAlt: string;
	imgWidth: number;
}

const ButtonWithLink = ({
	link,
	ariaLabel,
	buttonClassName,
	imgSrc,
	imgAlt,
	imgWidth,
}: ButtonWithLinkProps) => {
	return (
		<a href={link}>
			<button type="button" aria-label={ariaLabel} className={buttonClassName}>
				<img src={imgSrc} alt={imgAlt} width={imgWidth} />
			</button>
		</a>
	);
};

export default ButtonWithLink;
