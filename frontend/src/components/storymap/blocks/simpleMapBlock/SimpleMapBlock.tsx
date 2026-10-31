// import des bibliothèques
import DOMPurify from "dompurify";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, ScaleControl, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import TileLayerWithFallback from "../../../builtMap/map/tileLayerWithFallback/TileLayerWithFallback";
// import des composants
import MarkerComponent from "../../../builtMap/map/MarkerComponent/MarkerComponent";
import MapLegendControl from "./mapLegend/MapLegendControl";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { getAllPointsByBlockId } from "../../../../utils/api/builtMap/getRequests";
import {
  createClusterCustomIcon,
  getShapeForLayerName,
} from "../../../../utils/functions/icons";
import {
  getMapAttribution,
  handleClusterMouseOver,
} from "../../../../utils/functions/map";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type {
  ControlPosition,
  L,
  LatLngTuple,
  Map as LeafletMap,
} from "leaflet";
import type {
  MapColorType,
  MapIconType,
  PointType,
} from "../../../../utils/types/mapTypes";
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import "leaflet/dist/leaflet.css";
import "./simpleMapBlock.css";
import style from "./simpleMapBlock.module.scss";

interface SimpleMapBlockProps {
  blockContent: BlockContentType;
  mapName: string;
}

const SimpleMapBlock = ({ blockContent, mapName }: SimpleMapBlockProps) => {
  const mapCenter: LatLngTuple = [40.43, 16.52];

  const { language } = useTranslation();
  // récupération des données des stores
  const { selectedLanguage } = useStorymapLanguageStore();
  const { hasGrayScale } = useMapStore();

  const [map, setMap] = useState<LeafletMap | null>(null);
  const [points, setPoints] = useState<PointType[]>([]);

  const fetchAllPoints = useCallback(async () => {
    const allAttestationsPoints = await getAllPointsByBlockId(blockContent.id);
    setPoints(allAttestationsPoints);
  }, [blockContent.id]);

  useEffect(() => {
    fetchAllPoints();
  }, [fetchAllPoints]);

  // on met à jour les limites de la carte
  useEffect(() => {
    if (!map || points.length === 0) return;

    const bounds: LatLngTuple[] = points.map(({ latitude, longitude }) => [
      latitude,
      longitude,
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [points, map]);

  // récupérer les formes et les couleurs des attestations
  const allColorsAndShapes = useMemo(() => {
    return (blockContent.attestations ?? []).map(
      ({ name_fr, name_en, color, icon, position }) => ({
        name_fr,
        name_en,
        color: (color as MapColorType).code_hex,
        shape: (icon as MapIconType).name_en,
        position,
      })
    );
  }, [blockContent.attestations]);

  const sanitizedTitle = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content1_${selectedLanguage}`] || ""
    );
  }, [blockContent, selectedLanguage]);

  const tileAttribution = getMapAttribution(blockContent.content2_lang1);

  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    const clusterGroup = clusterRef.current;
    if (!clusterGroup) return;

    clusterGroup.on("clustermouseover", (e: L.LeafletEvent) =>
      handleClusterMouseOver(e)
    );

    return () => {
      clusterGroup.off("clustermouseover", (e: L.LeafletEvent) =>
        handleClusterMouseOver(e)
      );
    };
  }, [map]);

  // au montage, ajout d'un label aux boutons de zoom pour l'accessibilité
  useEffect(() => {
    const zoomIn = document.querySelector(".leaflet-control-zoom-in");
    const zoomOut = document.querySelector(".leaflet-control-zoom-out");

    if (zoomIn) zoomIn.setAttribute("aria-label", "Zoomer");
    if (zoomOut) zoomOut.setAttribute("aria-label", "Dézoomer");
  }, []);

  return (
    <>
      <div
        id={mapName}
        style={{ filter: hasGrayScale ? "grayscale(100%)" : "none" }}
      >
        <MapContainer
          center={mapCenter}
          scrollWheelZoom={false}
          minZoom={4}
          maxZoom={11}
          zoomControl={false}
          ref={setMap}
          keyboard={true} // accessibilité
        >
          <>
            <TileLayerWithFallback
              opacity={0.6}
              attribution={`dCART | &copy; ${tileAttribution}`}
              url={blockContent.content2_lang1}
            />
            <MarkerClusterGroup
              ref={clusterRef}
              spiderfyOnClick={false}
              spiderfyOnMaxZoom={false}
              showCoverageOnHover={false}
              zoomToBoundsOnClick={false}
              disableClusteringAtZoom={12}
              maxClusterRadius={1}
              disableSpiderfy={true}
              iconCreateFunction={createClusterCustomIcon}
              key={hasGrayScale.toString()}
            >
              {points.length > 0 ? (
                points.map((point: PointType) => {
                  return (
                    <MarkerComponent
                      key={`${point.latitude}-${point.longitude}-${point.color}-${point.shape}`}
                      point={point}
                      {...{ hasGrayScale }}
                    />
                  );
                })
              ) : (
                <div>Aucun résultat</div>
              )}
            </MarkerClusterGroup>
            {allColorsAndShapes.length > 0 && (
              <MapLegendControl
                // position choisie dans le formulaire de la carte
                position={
                  (blockContent.content3 ?? undefined) as
                    | ControlPosition
                    | undefined
                }
                items={allColorsAndShapes
                  .sort((a, b) => a.position - b.position)
                  .map((layer) => ({
                    icon: getShapeForLayerName(
                      layer.shape,
                      layer.color,
                      hasGrayScale
                    ),
                    name: layer[`name_${language}`],
                  }))}
              />
            )}
            <ZoomControl position="topright" />
            <ScaleControl position="bottomright" />
          </>
        </MapContainer>
      </div>
      <h4 // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
        className={style.mapTitle}
        dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
      />
    </>
  );
};

export default SimpleMapBlock;
