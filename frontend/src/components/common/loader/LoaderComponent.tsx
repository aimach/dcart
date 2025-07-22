// import du style
import style from "./loaderComponent.module.scss";

interface LoaderComponentProps {
	size: number;
}

/**
 * Composant de chargement
 * @param {number} size - Taille du loader
 */
const LoaderComponent = ({ size }: LoaderComponentProps) => {
	const classNames = `${style.loader} ${style[`loader-${size}`]}`;
	return <div className={classNames} />;
};

export default LoaderComponent;
