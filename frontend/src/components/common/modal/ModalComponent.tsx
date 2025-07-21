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
	isOverflowed?: boolean;
	children: React.ReactNode;
}

/**
 * Composant de la modale : fenêtre modale affichée par-dessus le reste de l'application, avec un bouton pour quitter
 * @param {Object} props - Les propriétés du composant
 * @param {boolean} props.isOverflowed - Indique si le contenu déborde
 * @param {() => void} props.onClose - Fonction de fermeture de la modale
 * @param {React.ReactNode} props.children - Contenu de la modale
 * @returns {JSX.Element} - Le composant ModalComponent
 */
const ModalComponent = ({
	onClose,
	isOverflowed = true,
	children,
}: ModalComponentProps) => {
	const { tutorialStep } = useMapStore();
	const modalContentClassName =
		tutorialStep >= 6
			? `${style.modalContent} ${style.modalContentToRight}`
			: isOverflowed
				? style.modalContentWithOverflow
				: style.modalContent;

	return (
		<div
			className={
				tutorialStep === 2
					? `${style.modalOverlayWhite} ${style.modalOverlay}`
					: style.modalOverlay
			}
		>
			<div className={`${modalContentClassName}`}>
				<button
					type="button"
					className={style.modalClose}
					onClick={onClose}
					aria-label="Fermer la modale"
				>
					<CircleX />
				</button>
				{children}
			</div>
		</div>
	);
};

export default ModalComponent;
