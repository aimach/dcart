// import des services
import { apiClient } from "./apiClient";
import { notifyCreateSuccess, notifyError } from "../functions/toast";
import { toast } from "react-toastify";
// import des types
import type { User } from "../types/userTypes";
import { userInputType } from "../../components/form/userForm/AddUserForm";

/**
 * Récupération du profile de l'utilisateur
 * @param accessToken - Token d'accès
 * @returns le profile de l'utilisateur
 */
const getProfile = async (accessToken: string) => {
	try {
		const response = await apiClient.get("/auth/profile", {
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement des données de l'utilisateur :",
			error,
		);
	}
};

/**
 * Fonction de connexion de l'utilisateur
 * @param body - les données de connexion
 * @returns booléan
 */
const loginUser = async (body: User) => {
	try {
		const loginUserResponse = await apiClient.post("/auth/login", body, {
			withCredentials: true,
		});
		if (loginUserResponse.status === 200) {
			return loginUserResponse.data;
		}
		return false;
	} catch (error) {
		console.error("Erreur lors de la connexion de l'utilisateur :", error);
	}
};

/**
 * Fonction de déconnexion de l'utilisateur
 */
const logoutUser = async () => {
	try {
		const response = await apiClient.get("/auth/logout", {
			withCredentials: true,
		});
		if (response.status === 200) {
			return true;
		}
		return false;
	} catch (error) {
		console.error("Erreur lors de la déconnexion de l'utilisateur :", error);
	}
};

/**
 * Fonction de rafraichissement du token d'accès
 * @returns le nouveau token d'accès
 */
const refreshAccessToken = async () => {
	try {
		const response = await apiClient.post(
			"/auth/refresh-token",
			{},
			{ withCredentials: true },
		);
		return response.data.accessToken;
	} catch (error) {
		console.error("Erreur lors du rafraîchissement du jeton :", error);
	}
};

/**
 * Fonction d'envoi d'un email de réinitialisation de mot de passe
 * @param email - l'email de l'utilisateur
 */
const sendResetPasswordRequest = async (email: string) => {
	try {
		const response = await apiClient.post("/auth/request-reset-password", {
			email,
		});
		if (response.status === 200) {
			toast.success("Demande envoyée", {
				position: "top-right",
				autoClose: 2000,
				closeOnClick: true,
				pauseOnHover: false,
				theme: "light",
			});
		}
	} catch (error) {
		notifyError(
			"Erreur lors de l'envoi de la demande de réinitialisation du mot de passe",
		);
	}
};

/**
 * Fonction d'envoi de réinitialisation de mot de passe
 * @param email - l'email de l'utilisateur
 * @param token - le token de réinitialisation
 * @param newPassword - le nouveau mot de passe
 */
const resetPassword = async (
	email: string,
	token: string,
	newPassword: string,
) => {
	try {
		const response = await apiClient.post("/auth/reset-password", {
			email,
			token,
			newPassword,
		});
		if (response.status === 200) {
			toast.success("Mot de passe réinitialisé", {
				position: "top-right",
				autoClose: 2000,
				closeOnClick: true,
				pauseOnHover: false,
				theme: "light",
			});
		}
	} catch (error) {
		notifyError("Erreur lors de la réinitialisation du mot de passe");
	}
};

/**
 * Fonction de création d'un utilisateur
 * @param body - les données de l'utilisateur
 */
const createNewUser = async (body: userInputType) => {
	try {
		const response = await apiClient.post("/auth/register", body);
		if (response.status === 201) {
			notifyCreateSuccess("Utilisateur", false);
		}
	} catch (error) {
		notifyError("Erreur lors de la réinitialisation du mot de passe");
	}
};

export {
	loginUser,
	logoutUser,
	getProfile,
	refreshAccessToken,
	sendResetPasswordRequest,
	resetPassword,
	createNewUser,
};
