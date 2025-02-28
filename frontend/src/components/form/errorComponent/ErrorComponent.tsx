// import des bibliothèques
// import des composants
// import du context
// import des services
// import des types
// import du style
import style from "./errorComponent.module.scss";
// import des icônes
import { CircleAlert } from "lucide-react";

type ErrorComponentProps = {
	message: string;
};

/**
 * Composant d'affichage des erreurs du formulaire
 * @param {Object} props
 * @param {string} props.message - Message d'erreur
 */
const ErrorComponent = ({ message }: ErrorComponentProps) => {
	return (
		<span className={style.error}>
			<CircleAlert />
			{message}
		</span>
	);
};

export default ErrorComponent;
