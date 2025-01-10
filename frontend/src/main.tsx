// import des bibliothèques
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
// import des composants
import App from "./App.tsx";
// import du style
import "./index.css";
import NavigationLayout from "./layouts/NavigationLayout.tsx";
import MapComponent from "./components/mapComponent/MapComponent.tsx";
import { TranslationProvider } from "./context/TranslationContext.tsx";
import AuthentificationPage from "./pages/AuthentificationPage.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
import BOHomePage from "./pages/BOHomePage.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import MenuPage from "./pages/MenuPage/MenuPage.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
	// l'ajout d'un if/else permet de résoudre une erreur relevée par le linter
	createRoot(rootElement).render(
		<BrowserRouter>
			<TranslationProvider>
				<AuthProvider>
					<StrictMode>
						<Routes>
							<Route element={<NavigationLayout />}>
								<Route index element={<App />} />
								<Route path="map" element={<MapComponent />} />
							</Route>
							<Route path="menu" element={<MenuPage />} />
							<Route
								path="authentification"
								element={<AuthentificationPage />}
							/>
							<Route path="backoffice" element={<ProtectedLayout />}>
								<Route index element={<BOHomePage />} />
							</Route>
						</Routes>
					</StrictMode>
				</AuthProvider>
			</TranslationProvider>
		</BrowserRouter>,
	);
} else {
	console.error("Root element not found");
}
