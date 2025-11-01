import type { TileLayer as LeafletTileLayer } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { TileLayer } from "react-leaflet";

interface TileLayerWithFallbackProps {
  url: string;
  attribution: string;
  opacity?: number;
}

/**
 * Composant TileLayer avec fallback automatique vers OpenStreetMap
 * En cas d'erreurs répétées de chargement de tuiles, bascule automatiquement vers OSM
 */
const TileLayerWithFallback = ({
  url,
  attribution,
  opacity = 1,
}: TileLayerWithFallbackProps) => {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [hasFallenBack, setHasFallenBack] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const errorCountRef = useRef(0); // Pour avoir la dernière valeur dans le handler

  const FALLBACK_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const FALLBACK_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const ERROR_THRESHOLD = 5; // Nombre d'erreurs avant basculement vers le fallback

  // Réinitialiser quand l'URL change (sélection manuelle d'un nouveau fond de carte)
  useEffect(() => {
    setCurrentUrl(url);
    setHasFallenBack(false);
    setErrorCount(0);
    errorCountRef.current = 0;
  }, [url]);

  // Callback ref pour attacher l'événement dès que le TileLayer est monté
  const tileLayerCallbackRef = (tileLayer: LeafletTileLayer | null) => {
    if (!tileLayer) return;

    const handleTileError = () => {
      errorCountRef.current += 1;
      const newCount = errorCountRef.current;
      setErrorCount(newCount);
    };

    tileLayer.on("tileerror", handleTileError);
  };

  // Basculer vers OSM après plusieurs erreurs
  useEffect(() => {
    if (
      errorCount >= ERROR_THRESHOLD &&
      !hasFallenBack &&
      currentUrl !== FALLBACK_URL
    ) {
      console.warn(
        "Fond de carte indisponible, basculement vers OpenStreetMap"
      );
      setCurrentUrl(FALLBACK_URL);
      setHasFallenBack(true);
      setErrorCount(0);
    }
  }, [errorCount, hasFallenBack, currentUrl, FALLBACK_URL]);

  return (
    <TileLayer
      ref={tileLayerCallbackRef}
      url={currentUrl}
      attribution={
        hasFallenBack ? `dCART | ${FALLBACK_ATTRIBUTION}` : attribution
      }
      opacity={opacity}
    />
  );
};

export default TileLayerWithFallback;
