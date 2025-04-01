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
	if (status) {
		toast.success(
			`${type} publiée`,
			getOtionsObject("top-right", 2000, true, false, "light"),
		);

		return;
	}
	if (status === false) {
		toast.info(
			`${type} masquée`,
			getOtionsObject("top-right", 2000, true, false, "light"),
		);
		return;
	}
};

const notifyCreateSuccess = (type: string, isFeminine: boolean) => {
	toast.success(
		`${type} créé${isFeminine ? "e" : ""}`,
		getOtionsObject("top-right", 2000, true, false, "light"),
	);
};

const notifyEditSuccess = (type: string, isFeminine: boolean) => {
	toast.success(
		`${type} modifié${isFeminine ? "e" : ""}`,
		getOtionsObject("top-right", 2000, true, false, "light"),
	);
};

const notifyDeleteSuccess = (type: string, isFeminine: boolean) => {
	toast.error(
		`${type} supprimé${isFeminine ? "e" : ""}`,
		getOtionsObject("top-right", 2000, true, false, "light"),
	);
};

const notifySuccessWithCustomMessage = (message: string) => {
	toast.success(
		message,
		getOtionsObject("top-right", 2000, true, false, "light"),
	);
};

const notifyUploadSuccess = (type: string) => {
	toast.success(
		`${type} chargés`,
		getOtionsObject("top-right", 2000, true, false, "light"),
	);
};

const notifyError = (message: string) => {
	toast.error(
		message,
		getOtionsObject("top-right", 2000, true, false, "colored"),
	);
};

export {
	notifyPublicationSuccess,
	notifyDeleteSuccess,
	notifyCreateSuccess,
	notifyEditSuccess,
	notifySuccessWithCustomMessage,
	notifyUploadSuccess,
	notifyError,
};
