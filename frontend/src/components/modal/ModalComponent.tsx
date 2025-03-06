// import des types
import type React from "react";
// import du style
import style from "./modalComponent.module.scss";

interface ModalComponentProps {
	onClose?: () => void;
	children: React.ReactNode;
	isDemo: boolean;
}

/**
 * Composant de la modale : fenêtre modale affichée par-dessus le reste de l'application, avec un bouton pour quitter
 * @param {Object} props - Les propriétés du composant
 * @param {() => void} props.onClose - Fonction de fermeture de la modale
 * @param {React.ReactNode} props.children - Contenu de la modale
 * @param {boolean} props.isDemo - Détermine si la modale est dans le formulaire de création/modification de la carte
 */
const ModalComponent = ({ onClose, children, isDemo }: ModalComponentProps) => {
	return (
		<div className={isDemo ? style.demoModalOverlay : style.modalOverlay}>
			<div className={style.modalContent}>
				<button type="button" className={style.modalClose} onClick={onClose}>
					&times;
				</button>
				{children}
			</div>
		</div>
	);
};

export default ModalComponent;
