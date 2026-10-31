// import des bibliothèques
import { useEffect, useMemo } from "react";
import { useController } from "react-hook-form";
// import des services
import { getCoverImageStyle } from "../../../utils/functions/storymap";
// import des types
import type { MouseEvent } from "react";
import type { Control } from "react-hook-form";
import type { allInputsType } from "../../../utils/types/formTypes";
// import du style
import style from "./coverImageFramingComponent.module.scss";

type CoverImageFramingComponentProps = {
  control: Control<allInputsType>;
  imageValue: string | File | null | undefined;
};

/**
 * Réglage du cadrage de l'image de couverture : zoom et point focal
 * Le point focal se place en cliquant sur l'aperçu ou avec les curseurs
 * @param control - le control du formulaire (react-hook-form)
 * @param imageValue - la valeur actuelle de l'input image (URL ou fichier)
 */
const CoverImageFramingComponent = ({
  control,
  imageValue,
}: CoverImageFramingComponentProps) => {
  const { field: zoom } = useController({
    name: "image_zoom" as keyof allInputsType,
    control,
  });
  const { field: positionX } = useController({
    name: "image_position_x" as keyof allInputsType,
    control,
  });
  const { field: positionY } = useController({
    name: "image_position_y" as keyof allInputsType,
    control,
  });

  const zoomValue = Number(zoom.value ?? 100);
  const xValue = Number(positionX.value ?? 50);
  const yValue = Number(positionY.value ?? 50);

  // URL de l'image à afficher (URL locale si un fichier vient d'être choisi)
  const imageUrl = useMemo(() => {
    if (imageValue instanceof File) return URL.createObjectURL(imageValue);
    return typeof imageValue === "string" ? imageValue : "";
  }, [imageValue]);

  // nettoyage des URLs locales pour éviter les fuites de mémoire
  useEffect(() => {
    return () => {
      if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handlePreviewClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const toPercent = (value: number) =>
      Math.round(Math.min(100, Math.max(0, value * 100)));
    positionX.onChange(toPercent((e.clientX - rect.left) / rect.width));
    positionY.onChange(toPercent((e.clientY - rect.top) / rect.height));
  };

  const handleReset = () => {
    zoom.onChange(100);
    positionX.onChange(50);
    positionY.onChange(50);
  };

  if (!imageUrl) {
    return (
      <p className={style.noImage}>
        Ajoutez une image de couverture pour régler son cadrage.
      </p>
    );
  }

  return (
    <div className={style.framingContainer}>
      <button
        type="button"
        className={style.preview}
        onClick={handlePreviewClick}
        title="Cliquer pour placer le point focal"
      >
        <div
          className={style.previewImage}
          style={getCoverImageStyle(imageUrl, zoomValue, xValue, yValue)}
        />
        <span
          className={style.focalPoint}
          style={{ left: `${xValue}%`, top: `${yValue}%` }}
        />
      </button>
      <div className={style.controls}>
        <label>
          Zoom ({zoomValue} %)
          <input
            type="range"
            min={100}
            max={300}
            step={5}
            value={zoomValue}
            onChange={(e) => zoom.onChange(Number(e.target.value))}
          />
        </label>
        <label>
          Position horizontale ({xValue} %)
          <input
            type="range"
            min={0}
            max={100}
            value={xValue}
            onChange={(e) => positionX.onChange(Number(e.target.value))}
          />
        </label>
        <label>
          Position verticale ({yValue} %)
          <input
            type="range"
            min={0}
            max={100}
            value={yValue}
            onChange={(e) => positionY.onChange(Number(e.target.value))}
          />
        </label>
        <button
          type="button"
          className={style.resetButton}
          onClick={handleReset}
        >
          Réinitialiser le cadrage
        </button>
      </div>
    </div>
  );
};

export default CoverImageFramingComponent;
