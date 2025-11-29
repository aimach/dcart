import { ImagePlus, Link, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import style from "./inputFileComponent.module.scss";

type InputFileComponentProps = {
  onChange: (value: string | File | null) => void;
  onError?: (error: string | null) => void;
  defaultValue?: string;
  label?: string;
};

type InputMode = "file" | "url";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const InputFileComponent = ({
  onChange,
  onError,
  defaultValue,
}: InputFileComponentProps) => {
  const [mode, setMode] = useState<InputMode>("file");
  const [urlValue, setUrlValue] = useState<string>("");

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

  // Initialisation du mode et de la valeur URL si defaultValue est une URL externe
  useEffect(() => {
    if (
      typeof defaultValue === "string" &&
      defaultValue &&
      !defaultValue.includes("/media/")
    ) {
      setMode("url");
      setUrlValue(defaultValue);
    }
  }, [defaultValue]);

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

      // Vérification de la taille du fichier
      if (file.size > MAX_FILE_SIZE) {
        const errorMessage =
          "Le fichier est trop volumineux. La taille maximale autorisée est de 2MB.";
        if (onError) {
          onError(errorMessage);
        }
        // Réinitialiser l'input
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }

      // Si tout est OK, on efface l'erreur précédente
      if (onError) {
        onError(null);
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      onChange(file);
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlValue(url);
    setPreview(url);
    onChange(url);
    // Effacer l'erreur si on passe en mode URL
    if (onError) {
      onError(null);
    }
  };

  const handleDelete = () => {
    setPreview(null);
    setUrlValue("");
    onChange("");
    if (onError) {
      onError(null);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const toggleMode = () => {
    handleDelete(); // Réinitialiser la valeur lors du changement de mode
    setMode(mode === "file" ? "url" : "file");
  };

  return (
    <div className={style.inputFileContainer}>
      {preview ? (
        <div className={style.previewContainer}>
          <img
            src={preview}
            alt="Prévisualisation"
            className={style.previewImage}
            onError={() => {
              // Si l'image ne charge pas (mauvaise URL), on peut éventuellement gérer ici
              // Mais pour l'instant on laisse l'image brisée par défaut du navigateur
            }}
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
      ) : mode === "file" ? (
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
      ) : (
        <div className={style.urlContainer}>
          <input
            type="text"
            placeholder="Entrez l'URL de l'image (https://...)"
            value={urlValue}
            onChange={handleUrlChange}
            className={style.urlInput}
          />
        </div>
      )}

      <div className={style.modeToggle}>
        <button
          type="button"
          onClick={toggleMode}
          className={style.toggleButton}
          title={
            mode === "file" ? "Passer à l'URL" : "Passer au téléchargement"
          }
        >
          {mode === "file" ? (
            <>
              <Link size={16} /> <span>Utiliser une URL</span>
            </>
          ) : (
            <>
              <Upload size={16} /> <span>Uploader un fichier</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputFileComponent;
