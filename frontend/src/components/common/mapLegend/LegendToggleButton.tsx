// import des bibliothèques
import { ChevronDown, ChevronUp } from "lucide-react";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import du style
import style from "./legendToggleButton.module.scss";

interface LegendToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * En-tête "Légende" d'une légende de carte, qui l'ouvre ou la ferme au clic
 */
const LegendToggleButton = ({ isOpen, onToggle }: LegendToggleButtonProps) => {
  const { translation, language } = useTranslation();

  return (
    <button
      type="button"
      className={style.legendToggle}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-label={
        isOpen
          ? translation[language].common.hideLegend
          : translation[language].common.showLegend
      }
      // utilisé par l'export de la carte en png pour ouvrir la légende et masquer le bouton
      data-legend-toggle
    >
      {translation[language].common.legend}
      {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
    </button>
  );
};

export default LegendToggleButton;
