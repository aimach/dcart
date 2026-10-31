// import des bibliothèques
import DOMPurify from "dompurify";
import L, { type ControlPosition } from "leaflet";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";
// import des composants
import LegendToggleButton from "../../../../common/mapLegend/LegendToggleButton";
// import des custom hooks
import { useWindowSize } from "../../../../../utils/hooks/useWindowSize";
// import du style
import style from "./mapLegendControl.module.scss";

export type MapLegendItemType = {
  // svg de la forme et de la couleur du jeu de points (généré par getShapeForLayerName)
  icon: string;
  // nom du jeu de points, qui peut contenir du html
  name: string;
};

interface MapLegendControlProps {
  items: MapLegendItemType[];
  position?: ControlPosition;
}

const LEGEND_POSITIONS: ControlPosition[] = [
  "topleft",
  "topright",
  "bottomleft",
  "bottomright",
];

/**
 * Légende d'une carte simple de storymap, sous forme de control Leaflet repliable
 */
const MapLegendControl = ({
  items,
  position = "bottomright",
}: MapLegendControlProps) => {
  const { isMobile } = useWindowSize();
  const map = useMap();

  // conteneur du control Leaflet, dans lequel le contenu React est rendu
  const [container, setContainer] = useState<HTMLElement | null>(null);
  // légende fermée par défaut sur mobile pour laisser la place à la carte
  const [isOpen, setIsOpen] = useState(!isMobile);

  // une valeur inconnue (bloc créé avant l'option) revient à la position par défaut
  const legendPosition = LEGEND_POSITIONS.includes(position)
    ? position
    : "bottomright";

  useEffect(() => {
    const control = new L.Control({ position: legendPosition });
    control.onAdd = () => {
      const div = L.DomUtil.create("div", style.legendControl);
      // les clics et le défilement dans la légende ne déplacent pas la carte
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);
      return div;
    };
    control.addTo(map);
    setContainer(control.getContainer() ?? null);

    return () => {
      control.remove();
    };
  }, [map, legendPosition]);

  if (!container) return null;

  return createPortal(
    <>
      <LegendToggleButton
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <ul className={style.legendItems}>
          {items.map((item) => (
            <li key={`${item.icon}-${item.name}`}>
              <span
                // biome-ignore lint/security/noDangerouslySetInnerHtml: svg généré par l'application
                dangerouslySetInnerHTML={{ __html: item.icon }}
              />
              <span
                // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(item.name),
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </>,
    container
  );
};

export default MapLegendControl;
