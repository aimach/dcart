// import des bibliothèques
import { toast } from "react-toastify";
// import des types
import type { ToastPosition } from "react-toastify";

const getOtionsObject = (
	position: ToastPosition,
	autoClose: number,
	closeOnClick: boolean,
	pauseOnHover: boolean,
	theme: string,
) => ({
	position,
	autoClose,
	closeOnClick,
	pauseOnHover,
	theme,
});

const notifyPublicationSuccess = (type: string, status: boolean) => {
	const typeMessage = type === "map" ? "Carte" : "Storymap";
	if (status) {
		toast.success(
			`${typeMessage} publiée`,
			getOtionsObject("top-right", 2000, true, false, "light"),
		);

		return;
	}
	if (status === false) {
		toast.info(
			`${typeMessage} masquée`,
			getOtionsObject("top-right", 2000, true, false, "light"),
		);
		return;
	}
};

const notifyDeleteSuccess = (type: string) => {
	toast.success(
		`${type} supprimée`,
		getOtionsObject("top-right", 2000, true, false, "light"),
	);
};

export { notifyPublicationSuccess, notifyDeleteSuccess };
