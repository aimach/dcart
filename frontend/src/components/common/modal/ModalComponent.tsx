// import des services
import { useMapStore } from "../../../utils/stores/builtMap/mapStore";
// import des types
import type React from "react";
// import du style
import style from "./modalComponent.module.scss";
// import des icônes
import { CircleX } from "lucide-react";

interface ModalComponentProps {
	onClose?: () => void;
	children: React.ReactNode;
}

/**
 * Composant de la modale : fenêtre modale affichée par-dessus le reste de l'application, avec un bouton pour quitter
 * @param {Object} props - Les propriétés du composant
 * @param {() => void} props.onClose - Fonction de fermeture de la modale
 * @param {boolean} props.isGreyBackground - Indique si le fond de la modale est gris
 * @param {React.ReactNode} props.children - Contenu de la modale
 * @returns {JSX.Element} - Le composant ModalComponent
 */
const ModalComponent = ({ onClose, children }: ModalComponentProps) => {
	const { tutorialStep } = useMapStore();
	return (
		<div
			className={
				tutorialStep === 2
					? `${style.modalOverlayWhite} ${style.modalOverlay}`
					: style.modalOverlay
			}
		>
			<div className={style.modalContent}>
				<button type="button" className={style.modalClose} onClick={onClose}>
					<CircleX />
				</button>
				{children}
			</div>
		</div>
	);
};

export default ModalComponent;
