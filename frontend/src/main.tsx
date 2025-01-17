// import des bibliothèques
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
// import des composants
import App from "./App.tsx";
import NavigationLayout from "./layouts/NavigationLayout.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
import AuthentificationPage from "./pages/AuthentificationPage.tsx";
import BOHomePage from "./pages/BOHomePage.tsx";
import MenuPage from "./pages/MenuPage/MenuPage.tsx";
import MapPage from "./pages/MapPage/MapPage.tsx";
import MapMenuPage from "./pages/MapMenuPage/MapMenuPage.tsx";
// import du contexte
import { AuthProvider } from "./context/AuthContext.tsx";
import { TranslationProvider } from "./context/TranslationContext.tsx";
import { MapAsideMenuProvider } from "./context/MapAsideMenuContext.tsx";
// import du style
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
	// l'ajout d'un if/else permet de résoudre une erreur relevée par le linter
	createRoot(rootElement).render(
		<BrowserRouter>
			<TranslationProvider>
				<AuthProvider>
					<MapAsideMenuProvider>
						{/* <StrictMode> */}
						<Routes>
							<Route element={<NavigationLayout />}>
								<Route index element={<App />} />
								<Route path="map">
									<Route index element={<MapMenuPage />} />
									<Route path=":mapId" element={<MapPage />} />
								</Route>
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
						{/* </StrictMode> */}
					</MapAsideMenuProvider>
				</AuthProvider>
			</TranslationProvider>
		</BrowserRouter>,
	);
} else {
	console.error("Root element not found");
}
