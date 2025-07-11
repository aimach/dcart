// import des bibliothèques
import { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
// import des composants
import App from "./App.tsx";
import NavigationLayout from "./layouts/NavigationLayout.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";
const MapPage = lazy(() => import("./pages/MapPage/MapPage.tsx"));
const StorymapPage = lazy(
	() =>
		import("./pages/BackOffice/BOStorymapPage/storymapPage/StorymapPage.tsx"),
);
const AuthentificationPage = lazy(
	() =>
		import("./pages/BackOffice/AuthentificationPage/AuthentificationPage.tsx"),
);
const BOHomePage = lazy(
	() => import("./pages/BackOffice/BOHomePage/BOHomePage.tsx"),
);
const BackofficeMapPage = lazy(
	() => import("./pages/BackOffice/BOMapPage/BackofficeMapPage.tsx"),
);
const BackofficeStorymapPage = lazy(
	() => import("./pages/BackOffice/BOStorymapPage/BackofficeStorymapPage.tsx"),
);
const BackofficeTranslationPage = lazy(
	() =>
		import(
			"./pages/BackOffice/BOTranslationPage/BackofficeTranslationPage.tsx"
		),
);
const BOMapFormPage = lazy(
	() => import("./pages/BackOffice/BOMapFormPage.tsx/BOMapFormPage.tsx"),
);
const TagPage = lazy(() => import("./pages/TagPage/TagPage.tsx"));
const StorymapIntroPage = lazy(
	() =>
		import(
			"./pages/BackOffice/BOStorymapPage/storymapIntroPage/StorymapIntroPage.tsx"
		),
);
const UserManagementPage = lazy(
	() =>
		import("./pages/BackOffice/BOUserManagementPage/BOUserManagementPage.tsx"),
);
const TagManagementPage = lazy(
	() =>
		import("./pages/BackOffice/BOTagManagementPage/BOTagManagementPage.tsx"),
);
const DivinityManagementPage = lazy(
	() =>
		import(
			"./pages/BackOffice/BODivinityManagementPage/BODivinityManagementPage.tsx"
		),
);
const LegalNoticePage = lazy(() => import("./pages/Legal/LegalNoticePage.tsx"));
const ResetPasswordPage = lazy(
	() => import("./pages/ResetPasswordPage/ResetPasswordPage.tsx"),
);
const NewPasswordPage = lazy(
	() => import("./pages/ResetPasswordPage/NewPasswordPage.tsx"),
);
const NotFoundPage = lazy(
	() => import("./pages/NotFoundPage/NotFoundPage.tsx"),
);
import ScrollToTop from "./components/common/scroll/ScrollToTop.tsx";
// import du contexte
import { AuthProvider } from "./context/AuthContext.tsx";
import { TranslationProvider } from "./context/TranslationContext.tsx";
import { IconOptionsProvider } from "./context/IconOptionsContext.tsx";
import { TagOptionsProvider } from "./context/TagContext.tsx";
import { SessionProvider } from "./context/SessionContext.tsx";
// import du style
import "./index.css";
import LoaderComponent from "./components/common/loader/LoaderComponent.tsx";

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
								<HelmetProvider>
									<Suspense fallback={<LoaderComponent size={50} />}>
										{/* Routes de l'application */}
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
												{/* Route catch-all pour les pages non trouvées */}
												<Route path="*" element={<NotFoundPage />} />
												<Route path="404" element={<NotFoundPage />} />
											</Route>
											<Route path="backoffice" element={<ProtectedLayout />}>
												<Route index element={<BOHomePage />} />
												<Route path="maps">
													<Route index element={<BackofficeMapPage />} />
													<Route path="create" element={<BOMapFormPage />} />
													<Route
														path="edit/:mapId"
														element={<BOMapFormPage />}
													/>
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
												{/* Route catch-all pour les pages non trouvées */}
												<Route path="*" element={<NotFoundPage />} />
												<Route path="404" element={<NotFoundPage />} />
											</Route>
											<Route
												path="authentification"
												element={<AuthentificationPage />}
											/>
											<Route
												path="forgot-password"
												element={<ResetPasswordPage />}
											/>
											<Route
												path="reset-password"
												element={<NewPasswordPage />}
											/>

											{/* Route catch-all pour les pages non trouvées */}
											<Route path="*" element={<NotFoundPage />} />
										</Routes>
									</Suspense>
								</HelmetProvider>
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
