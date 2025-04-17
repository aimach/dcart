import { forwardRef, useEffect, useRef } from "react";
import Quill from "quill";
// import des types
import type { MutableRefObject } from "react";
// import du style
import "quill/dist/quill.snow.css";
import "./wysiwygBlock.css";

// on type la ref pour Quill
type QuillEditorRef = MutableRefObject<Quill | null>;

interface EditorComponentProps {
	onChange: (content: string) => void;
	defaultValue: string | null;
}

/**
 * Affiche un éditeur WYSIWYG avec Quill
 * @param onChange Fonction appelée à chaque modification de l'éditeur
 * @param defaultValue Valeur par défaut de l'éditeur
 */
const EditorComponent = forwardRef(
	({ onChange, defaultValue }: EditorComponentProps, ref) => {
		const containerRef = useRef<HTMLDivElement | null>(null);

		// biome-ignore lint/correctness/useExhaustiveDependencies:
		useEffect(() => {
			const container = containerRef.current as HTMLDivElement;
			if (!container) return;

			const editorContainer = container.appendChild(
				container.ownerDocument.createElement("div"),
			);

			// enregistrement des tailles
			const Size = Quill.import("formats/size") as { whitelist: string[] };
			Size.whitelist = ["small", "normal", "large", "huge"];
			Quill.register(Size, true);

			// enregistrement des polices disponibles
			const Font = Quill.import("formats/font") as { whitelist: string[] };
			Font.whitelist = ["arial", "georgia", "courier", "times", "monospace"];
			Quill.register(Font, true);

			// Définition de la toolbar personnalisée
			const toolbarOptions = [
				["bold", "italic", "underline", "strike"], // Gras, italique, souligné, barré
				[{ size: ["small", false, "large", "huge"] }], // Taille du texte
				[{ font: ["arial", "georgia", "courier", "times", "monospace"] }], // Polices
				[{ list: "ordered" }, { list: "bullet" }], // Listes numérotées et à puces
				[{ script: "sub" }, { script: "super" }], // Indice / exposant
				[{ indent: "-1" }, { indent: "+1" }], // Indentation
				[{ direction: "rtl" }], // Texte de droite à gauche
				[{ color: [] }, { background: [] }], // Couleur du texte et de fond
				[{ align: [] }], // Alignement du texte
				["link"], // Ajout de liens, images, vidéos
				["clean"], // Bouton pour supprimer le formatage
			];

			const quill = new Quill(editorContainer, {
				theme: "snow",
				modules: {
					toolbar: toolbarOptions,
				},
			});

			if (ref && typeof ref === "object") {
				(ref as QuillEditorRef).current = quill;
			}

			if (defaultValue) {
				quill.root.innerHTML = defaultValue;
			}

			quill.on("text-change", () => {
				onChange(quill.root.innerHTML);
			});

			return () => {
				if (ref && typeof ref === "object") {
					(ref as QuillEditorRef).current = null;
				}
				container.innerHTML = "";
			};
		}, [ref]);

		return (
			<>
				<div ref={containerRef} />
				<div id="counter" />
			</>
		);
	},
);

EditorComponent.displayName = "Editor";

export default EditorComponent;
