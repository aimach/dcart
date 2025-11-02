// import des bibliothèques
import { Link, useLocation } from "react-router";
// import des icônes
import { Pen } from "lucide-react";
// import des types
import type { BlockContentType } from "../../../utils/types/storymapTypes";
// import du style
import style from "./editableBlockWrapper.module.scss";

interface EditableBlockWrapperProps {
  children: React.ReactNode;
  block: BlockContentType;
  storymapId?: string;
  isPreview: boolean;
}

const EditableBlockWrapper = ({
  children,
  block,
  storymapId,
  isPreview,
}: EditableBlockWrapperProps) => {
  const location = useLocation();

  const handleEditClick = () => {
    if (storymapId) {
      const scrollPosition = window.scrollY;
      const cleanStorymapId = storymapId.split("?")[0];
      sessionStorage.setItem(
        `storymap_scroll_position_${cleanStorymapId}`,
        scrollPosition.toString()
      );
    }
  };

  if (!isPreview) {
    return <>{children}</>;
  }

  return (
    <div className={style.editableBlockContainer}>
      {children}
      <Link
        to={`/backoffice/storymaps/${storymapId}?action=edit`}
        state={{ from: location.pathname, block: block }}
        className={style.editButton}
        onClick={handleEditClick}
      >
        <Pen size={20} />
      </Link>
    </div>
  );
};

export default EditableBlockWrapper;
