import type { TileLayer as LeafletTileLayer } from "leaflet";
import { useEffect, useRef } from "react";
import { TileLayer, useMap } from "react-leaflet";
import { enableTileLayerFallback } from "../../../../utils/functions/map";

interface TileLayerWithFallbackProps {
  url: string;
  attribution: string;
  opacity?: number;
}

/**
 * Composant TileLayer avec fallback automatique vers OpenStreetMap
 * Si le fond de carte ne répond pas, bascule automatiquement vers OSM
 */
const TileLayerWithFallback = ({
  url,
  attribution,
  opacity = 1,
}: TileLayerWithFallbackProps) => {
  const map = useMap();
  const tileLayerRef = useRef<LeafletTileLayer | null>(null);

  // surveillance relancée quand l'URL change (sélection manuelle d'un nouveau fond de carte)
  useEffect(() => {
    if (!tileLayerRef.current) return;
    return enableTileLayerFallback(map, tileLayerRef.current, url);
  }, [map, url]);

  return (
    <TileLayer
      // la key recrée le calque si l'URL change, après un éventuel basculement vers OSM
      key={url}
      ref={tileLayerRef}
      url={url}
      attribution={attribution}
      opacity={opacity}
    />
  );
};

export default TileLayerWithFallback;
