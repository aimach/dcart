// import des bibliothèques
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
// import des composants
import App from "./App.tsx";
import NavigationLayout from "./layouts/NavigationLayout.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
import AuthentificationPage from "./pages/BackOffice/AuthentificationPage/AuthentificationPage.tsx";
import BOHomePage from "./pages/BackOffice/BOHomePage/BOHomePage.tsx";
import MapPage from "./pages/MapPage/MapPage.tsx";
import BackofficeMapPage from "./pages/BackOffice/BOMapPage/BackofficeMapPage.tsx";
import BackofficeStorymapPage from "./pages/BackOffice/BOStorymapPage/BackofficeStorymapPage.tsx";
import BackofficeTranslationPage from "./pages/BackOffice/BOTranslationPage/BackofficeTranslationPage.tsx";
import CategoryMenuPage from "./pages/CategoryMenuPage/CategoryMenuPage.tsx";
import BOMapFormPage from "./pages/BackOffice/BOMapFormPage.tsx/BOMapFormPage.tsx";
// import du contexte
import { AuthProvider } from "./context/AuthContext.tsx";
import { TranslationProvider } from "./context/TranslationContext.tsx";
// import du style
import "./index.css";
import StorymapIntroPage from "./pages/BackOffice/BOStorymapPage/storymapIntroPage/StorymapIntroPage.tsx";
import StorymapBuilderPage from "./pages/BackOffice/BOStorymapPage/storymapBuilder/StorymapBuilderPage.tsx";
import StorymapPage from "./pages/BackOffice/BOStorymapPage/storymapPage/StorymapPage.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
	// l'ajout d'un if/else permet de résoudre une erreur relevée par le linter
	createRoot(rootElement).render(
		<BrowserRouter>
			<TranslationProvider>
				<AuthProvider>
					<Routes>
						<Route element={<NavigationLayout />}>
							<Route index element={<App />} />
							<Route path="maps/categories">
								<Route index element={<CategoryMenuPage />} />
								<Route path=":categoryId">
									<Route path="map/:mapId" element={<MapPage />} />
								</Route>
							</Route>
							<Route path="storymaps/categories">
								<Route index element={<CategoryMenuPage />} />
								<Route path=":categoryId">
									<Route path="storymaps/:mapId" element={<MapPage />} />
								</Route>
							</Route>
						</Route>
						<Route path="authentification" element={<AuthentificationPage />} />
						<Route path="backoffice" element={<ProtectedLayout />}>
							<Route index element={<BOHomePage />} />
							<Route path="maps">
								<Route index element={<BackofficeMapPage />} />
								<Route path="create" element={<BOMapFormPage />} />
								<Route path="edit/:mapId" element={<BOMapFormPage />} />
							</Route>
							<Route path="storymaps">
								<Route index element={<BackofficeStorymapPage />} />
								<Route path="create" element={<StorymapIntroPage />} />
								<Route
									path="build/:storymapId"
									element={<StorymapBuilderPage />}
								/>
								<Route
									path="edit/:storymapId"
									element={<StorymapIntroPage />}
								/>
								<Route path="view/:storymapId" element={<StorymapPage />} />
							</Route>
							<Route
								path="translation"
								element={<BackofficeTranslationPage />}
							/>
						</Route>
					</Routes>
				</AuthProvider>
			</TranslationProvider>
		</BrowserRouter>,
	);
} else {
	console.error("Root element not found");
}
