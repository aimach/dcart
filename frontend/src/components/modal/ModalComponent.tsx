// import des types
import type React from "react";
// import du style
import style from "./modalComponent.module.scss";

interface ModalComponentProps {
	onClose: () => void;
	children: React.ReactNode;
	isDemo: boolean;
}

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
