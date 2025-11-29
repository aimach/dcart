import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import style from "./inputFileComponent.module.scss";

type InputFileComponentProps = {
  onChange: (value: string | File | null) => void;
  defaultValue?: string;
  label?: string;
};

const InputFileComponent = ({
  onChange,
  defaultValue,
}: InputFileComponentProps) => {
  const getThumbnailUrl = (value: string | File | null | undefined) => {
    if (typeof value === "string" && value.includes("/dcart/media/original/")) {
      return value.replace("/dcart/media/original/", "/dcart/media/thumb/");
    }
    // Fallback pour la rétrocompatibilité ou si le chemin est différent
    if (typeof value === "string" && value.includes("/media/original/")) {
      return value.replace("/media/original/", "/media/thumb/");
    }
    if (typeof value === "string") {
      return value;
    }
    return null;
  };

  const thumbnailUrl = getThumbnailUrl(defaultValue);
  const [preview, setPreview] = useState<string | null>(thumbnailUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  // Nettoyage des URLs locales pour éviter les fuites de mémoire
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      onChange(file);
    }
  };

  const handleDelete = () => {
    setPreview(null);
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={style.inputFileContainer}>
      {preview ? (
        <div className={style.previewContainer}>
          <img
            src={preview}
            alt="Prévisualisation"
            className={style.previewImage}
          />
          <button
            type="button"
            onClick={handleDelete}
            className={style.deleteButton}
            title="Supprimer l'image"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ) : (
        <div className={style.uploadContainer}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="file-upload"
            className={style.hiddenInput}
            ref={inputRef}
          />
          <label htmlFor="file-upload" className={style.uploadLabel}>
            <ImagePlus size={24} />
            <span>Choisir une image</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default InputFileComponent;
