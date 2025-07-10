// import des bibliothèques
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
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
import BOMapFormPage from "./pages/BackOffice/BOMapFormPage.tsx/BOMapFormPage.tsx";
import TagPage from "./pages/TagPage/TagPage.tsx";
import StorymapIntroPage from "./pages/BackOffice/BOStorymapPage/storymapIntroPage/StorymapIntroPage.tsx";
import StorymapPage from "./pages/BackOffice/BOStorymapPage/storymapPage/StorymapPage.tsx";
import UserManagementPage from "./pages/BackOffice/BOUserManagementPage/BOUserManagementPage.tsx";
import TagManagementPage from "./pages/BackOffice/BOTagManagementPage/BOTagManagementPage.tsx";
import DivinityManagementPage from "./pages/BackOffice/BODivinityManagementPage/BODivinityManagementPage.tsx";
import LegalNoticePage from "./pages/Legal/LegalNoticePage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage.tsx";
import NewPasswordPage from "./pages/ResetPasswordPage/NewPasswordPage.tsx";
import ScrollToTop from "./components/common/scroll/ScrollToTop.tsx";
// import du contexte
import { AuthProvider } from "./context/AuthContext.tsx";
import { TranslationProvider } from "./context/TranslationContext.tsx";
import { IconOptionsProvider } from "./context/IconOptionsContext.tsx";
import { TagOptionsProvider } from "./context/TagContext.tsx";
import { SessionProvider } from "./context/SessionContext.tsx";
// import du style
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
	// l'ajout d'un if/else permet de résoudre une erreur relevée par le linter
	createRoot(rootElement).render(
		<HashRouter>
			<ScrollToTop />
			<TranslationProvider>
				<AuthProvider>
					<SessionProvider>
						<IconOptionsProvider>
							<TagOptionsProvider>
								<Routes>
									<Route element={<NavigationLayout />}>
										<Route index element={<App />} />
										<Route path="tag/:tagSlug">
											<Route index element={<TagPage />} />
										</Route>
										<Route path="map/:mapSlug" element={<MapPage />} />

										<Route
											path="storymap/:storymapSlug"
											element={<StorymapPage />}
										/>
										<Route
											path="mentions-legales"
											element={<LegalNoticePage />}
										/>
									</Route>
									<Route path="backoffice" element={<ProtectedLayout />}>
										<Route index element={<BOHomePage />} />
										<Route path="maps">
											<Route index element={<BackofficeMapPage />} />
											<Route path="create" element={<BOMapFormPage />} />
											<Route path="edit/:mapId" element={<BOMapFormPage />} />
											<Route path="preview/:mapId" element={<MapPage />} />
										</Route>
										<Route path="storymaps">
											<Route index element={<BackofficeStorymapPage />} />
											<Route
												path=":storymapId"
												element={<StorymapIntroPage />}
											/>
											<Route
												path="preview/:storymapId"
												element={<StorymapPage />}
											/>
										</Route>
										<Route
											path="translation"
											element={<BackofficeTranslationPage />}
										/>
										<Route path="users" element={<UserManagementPage />} />
										<Route path="tags" element={<TagManagementPage />} />
										<Route
											path="divinities"
											element={<DivinityManagementPage />}
										/>
									</Route>
									<Route
										path="authentification"
										element={<AuthentificationPage />}
									/>
									<Route
										path="forgot-password"
										element={<ResetPasswordPage />}
									/>
									<Route path="reset-password" element={<NewPasswordPage />} />
								</Routes>
								<ToastContainer />
							</TagOptionsProvider>
						</IconOptionsProvider>
					</SessionProvider>
				</AuthProvider>
			</TranslationProvider>
		</HashRouter>,
	);
} else {
	console.error("Root element not found");
}
