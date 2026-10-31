// import des bibliothèques
import L from "leaflet";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
// import des composants
import LegendToggleButton from "./LegendToggleButton";
// import des custom hooks
import { useWindowSize } from "../../../utils/hooks/useWindowSize";
// import du style
import style from "./layersControlToggle.module.scss";

interface LayersControlToggleProps {
  control: L.Control.Layers | null;
}

/**
 * Ajoute un bouton "Légende" pour ouvrir ou fermer le control de calques Leaflet utilisé comme légende
 */
const LayersControlToggle = ({ control }: LayersControlToggleProps) => {
  const { isMobile } = useWindowSize();

  // en-tête ajouté en haut du control, dans lequel le bouton est rendu
  const [header, setHeader] = useState<HTMLElement | null>(null);
  // légende fermée par défaut sur mobile pour laisser la place à la carte
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    const container = control?.getContainer();
    if (!container) return;

    const div = L.DomUtil.create("div", style.layersControlHeader);
    L.DomEvent.disableClickPropagation(div);
    container.prepend(div);
    setHeader(div);

    return () => {
      div.remove();
      setHeader(null);
    };
  }, [control]);

  // la liste des calques est masquée quand la légende est fermée
  useEffect(() => {
    control?.getContainer()?.classList.toggle(style.closed, !isOpen);
  }, [control, isOpen]);

  if (!header) return null;

  return createPortal(
    <LegendToggleButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />,
    header
  );
};

export default LayersControlToggle;
