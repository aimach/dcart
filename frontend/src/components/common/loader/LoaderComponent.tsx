// import du style
import style from "./loaderComponent.module.scss";

interface LoaderComponentProps {
	size: number;
}

const LoaderComponent = ({ size }: LoaderComponentProps) => {
	const classNames = `${style.loader} ${style[`loader-${size}`]}`;
	return <div className={classNames} />;
};

export default LoaderComponent;
