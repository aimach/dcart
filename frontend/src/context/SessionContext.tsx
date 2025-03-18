// import des bibliothèques
import { useState, createContext, useEffect } from "react";
import { useLocation } from "react-router";
// import des services
import { deleteSession, pingSession } from "../utils/api/sessionAPI";
import { apiClient } from "../utils/api/apiClient";

type SessionContextType = {
	session: Record<string, string> | null;
	setSession: React.Dispatch<
		React.SetStateAction<Record<string, string> | null>
	>;
	isTimeoutReached: boolean;
	setIsTimeoutReached: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SessionContext = createContext<SessionContextType>({
	session: null,
	setSession: () => {},
	isTimeoutReached: false,
	setIsTimeoutReached: () => {},
});

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [session, setSession] = useState<Record<string, string> | null>(null);
	const [isTimeoutReached, setIsTimeoutReached] = useState(false);
	const location = useLocation();

	useEffect(() => {
		if (session) {
			const startTime = new Date(session.createdAt).getTime();
			const now = Date.now();
			const timeoutDuration = startTime + 29 * 60 * 1000 - now; // 29 minutes après la création de la session

			if (timeoutDuration <= 0) {
				setIsTimeoutReached(true);
				return;
			}

			const timeout = setTimeout(() => {
				setIsTimeoutReached(true);
			}, timeoutDuration);

			// Cleanup en cas de démontage du composant
			return () => clearTimeout(timeout);
		}
	}, [session]);

	// suppression de la session si l'utilisateur quitte la page de modification
	useEffect(() => {
		const deleteSessionAfterNavigation = async () => {
			setIsTimeoutReached(false);
			setSession(null);
			await deleteSession();
		};
		if (!location.pathname.includes("/maps/edit/")) {
			deleteSessionAfterNavigation();
		}
	}, [location]);

	// vérification des sessions actives et suppression si besoin (si l'utilisateur a quitté l'application)
	useEffect(() => {
		const sendPing = async (session: Record<string, string>) => {
			await pingSession(session);
		};
		if (session) {
			// premier envoi
			sendPing(session);
			// envoi toutes les 20s
			const interval = setInterval(sendPing, 20000);
			return () => {
				clearInterval(interval);
			};
		}
	}, [session]);

	return (
		<SessionContext.Provider
			value={{ session, setSession, isTimeoutReached, setIsTimeoutReached }}
		>
			{children}
		</SessionContext.Provider>
	);
};
