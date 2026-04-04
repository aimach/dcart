import { isAxiosError } from "axios";

/**
 * Extrait un message lisible depuis la réponse d'erreur Axios (corps JSON ou chaîne).
 */
export function getAxiosErrorMessage(error: unknown): string | undefined {
	if (!isAxiosError(error)) {
		return undefined;
	}
	const data = error.response?.data;
	if (typeof data === "string" && data.trim() !== "") {
		return data;
	}
	if (
		data !== null &&
		typeof data === "object" &&
		"message" in data &&
		typeof (data as { message: unknown }).message === "string"
	) {
		return (data as { message: string }).message;
	}
	return undefined;
}
