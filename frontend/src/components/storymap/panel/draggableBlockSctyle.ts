// définition du style du container titre (icone + type de bloc)
const draggableBlockTitleStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "flex-start",
	gap: "10px",
	paddingBottom: "10px",
};

// définition du style du container des icones d'action (modifier, supprimer)
const draggableBlockActionContainerStyle: React.CSSProperties = {
	display: "flex",
	justifyContent: "flex-end",
	gap: "10px",
	paddingTop: "10px",
};

const draggableBlockTextContainerStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	textAlign: "left",
};

export {
	draggableBlockActionContainerStyle,
	draggableBlockTextContainerStyle,
	draggableBlockTitleStyle,
};
