// import des bibliothèques
import { Helmet } from "react-helmet-async";

const HomePageHelmetContent = () => {
	return (
		<Helmet>
			<title>Accueil | Atlas numérique des noms divins en Méditerranée</title>
			<meta
				name="description"
				content="Bienvenue sur la page d'accueil de l'Atlas numérique des noms divins en Méditerranée. Explorez les cartes et les storymaps des divinités."
			/>
			{/* Open Graph (pour Facebook, LinkedIn…) */}
			<meta
				property="og:title"
				content="Atlas numérique des noms divins en Méditerranée"
			/>
			<meta
				property="og:description"
				content="Bienvenue sur l'Atlas numérique des noms divins en Méditerranée, outil d'exploration de la BDD MAP via des cartes et storymaps."
			/>
			<meta property="og:url" content="https://dcart-map.huma-num.fr/" />
			<meta property="og:type" content="website" />

			{/* Twitter Cards */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta
				name="twitter:title"
				content="Atlas numérique des noms divins en Méditerranée"
			/>
			<meta
				name="twitter:description"
				content="Bienvenue sur l'Atlas numérique des noms divins en Méditerranée, outil d'exploration de la BDD MAP via des cartes et storymaps."
			/>

			{/* Canonical URL */}
			<link rel="canonical" href="https://dcart-map.huma-num.fr/" />
		</Helmet>
	);
};

const TagPageHelmetContent = ({ tagName }: { tagName: string }) => {
	return (
		<Helmet>
			<title>{`${tagName} | Atlas numérique des noms divins en Méditerranée`}</title>
			<meta
				name="description"
				content={`Explorez l'étiquette ${tagName} dans l'Atlas numérique des noms divins en Méditerranée. Découvrez les cartes et storymaps associées.`}
			/>
			{/* Open Graph (pour Facebook, LinkedIn…) */}
			<meta property="og:title" content={`${tagName}`} />
			<meta
				property="og:description"
				content={`Explorez l'étiquette ${tagName} dans l'Atlas numérique des noms divins en Méditerranée.`}
			/>
			<meta
				property="og:url"
				content={`https://dcart-map.huma-num.fr/#/tag/${tagName}`}
			/>
			<meta property="og:type" content="website" />

			{/* Twitter Cards */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={`${tagName}`} />
			<meta
				name="twitter:description"
				content={`Explorez l'étiquette ${tagName} dans l'Atlas numérique des noms divins en Méditerranée.`}
			/>

			{/* Canonical URL */}
			<link
				rel="canonical"
				href={`https://dcart-map.huma-num.fr/#/tag/${tagName}`}
			/>
		</Helmet>
	);
};

const MapPageHelmetContent = ({ mapName }: { mapName: string }) => {
	return (
		<Helmet>
			<title>{`Carte ${mapName} | Atlas numérique des noms divins en Méditerranée`}</title>
			<meta
				name="description"
				content={`Explorez la carte ${mapName} dans l'Atlas numérique des noms divins en Méditerranée.`}
			/>
			{/* Open Graph (pour Facebook, LinkedIn…) */}
			<meta property="og:title" content={`${mapName}`} />
			<meta
				property="og:description"
				content={`Explorez la carte ${mapName} dans l'Atlas numérique des noms divins en Méditerranée.`}
			/>
			<meta
				property="og:url"
				content={`https://dcart-map.huma-num.fr/#/map/${mapName}`}
			/>
			<meta property="og:type" content="website" />

			{/* Twitter Cards */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={`${mapName}`} />
			<meta
				name="twitter:description"
				content={`Explorez la carte ${mapName} dans l'Atlas numérique des noms divins en Méditerranée.`}
			/>

			{/* Canonical URL */}
			<link
				rel="canonical"
				href={`https://dcart-map.huma-num.fr/#/map/${mapName}`}
			/>
		</Helmet>
	);
};

const StorymapPageHelmetContent = ({
	storymapName,
}: { storymapName: string }) => {
	return (
		<Helmet>
			<title>{`Storymap ${storymapName} | Atlas numérique des noms divins en Méditerranée`}</title>
			<meta
				name="description"
				content={`Explorez la storymap ${storymapName} dans l'Atlas numérique des noms divins en Méditerranée.`}
			/>
			{/* Open Graph (pour Facebook, LinkedIn…) */}
			<meta property="og:title" content={`${storymapName}`} />
			<meta
				property="og:description"
				content={`Explorez la storymap ${storymapName} dans l'Atlas numérique des noms divins en Méditerranée.`}
			/>
			<meta
				property="og:url"
				content={`https://dcart-map.huma-num.fr/#/storymap/${storymapName}`}
			/>
			<meta property="og:type" content="website" />

			{/* Twitter Cards */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={`${storymapName}`} />
			<meta
				name="twitter:description"
				content={`Explorez la storymap ${storymapName} dans l'Atlas numérique des noms divins en Méditerranée.`}
			/>

			{/* Canonical URL */}
			<link
				rel="canonical"
				href={`https://dcart-map.huma-num.fr/#/storymap/${storymapName}`}
			/>
		</Helmet>
	);
};

const LegalNoticePageHelmetContent = () => {
	return (
		<Helmet>
			<title>
				Crédits et mentions légales | Atlas numérique des noms divins en
				Méditerranée
			</title>
			<meta
				name="description"
				content="Consultez les crédits et mentions légales de l'Atlas numérique des noms divins en Méditerranée."
			/>
			{/* Open Graph (pour Facebook, LinkedIn…) */}
			<meta property="og:title" content="Crédits et mentions légales" />
			<meta
				property="og:description"
				content="Consultez les crédits mentions légales de l'Atlas numérique des noms divins en Méditerranée."
			/>
			<meta
				property="og:url"
				content="https://dcart-map.huma-num.fr/#/mentions-legales"
			/>
			<meta property="og:type" content="website" />

			{/* Twitter Cards */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content="Crédits et mentions légales" />
			<meta
				name="twitter:description"
				content="Consultez les crédits et mentions légales de l'Atlas numérique des noms divins en Méditerranée."
			/>

			{/* Canonical URL */}
			<link
				rel="canonical"
				href="https://dcart-map.huma-num.fr/#/mentions-legales"
			/>
		</Helmet>
	);
};

const NotFoundPageHelmetContent = () => {
	return (
		<Helmet>
			<title>
				Page non trouvée | Atlas numérique des noms divins en Méditerranée
			</title>
			<meta
				name="description"
				content="La page que vous cherchez n'existe pas. Retournez à l'accueil de l'Atlas numérique des noms divins en Méditerranée."
			/>
			{/* Open Graph (pour Facebook, LinkedIn…) */}
			<meta property="og:title" content="Page non trouvée" />
			<meta
				property="og:description"
				content="La page que vous cherchez n'existe pas. Retournez à l'accueil de l'Atlas numérique des noms divins en Méditerranée."
			/>
			<meta property="og:url" content="https://dcart-map.huma-num.fr/#/404" />
			<meta property="og:type" content="website" />

			{/* Twitter Cards */}
			<meta name="twitter:title" content="Page non trouvée" />
			<meta
				name="twitter:description"
				content="La page que vous cherchez n'existe pas. Retournez à l'accueil de l'Atlas numérique des noms divins en Méditerranée."
			/>

			{/* Canonical URL */}
			<link rel="canonical" href="https://dcart-map.huma-num.fr/#/404" />
		</Helmet>
	);
};

const AuthentificationPageHelmetContent = () => {
	return (
		<Helmet>
			<title>
				Authentification | Atlas numérique des noms divins en Méditerranée
			</title>
			<meta name="robots" content="noindex, nofollow" />
			<meta
				name="description"
				content="Page d'authentification pour accéder au tableau de bord de l'Atlas numérique des noms divins en Méditerranée."
			/>
			{/* Canonical URL */}
			<link
				rel="canonical"
				href="https://dcart-map.huma-num.fr/#/authentification"
			/>
		</Helmet>
	);
};

const ForgotPasswordPageHelmetContent = () => {
	return (
		<Helmet>
			<title>
				Réinitialisation du mot de passe | Atlas numérique des noms divins en
				Méditerranée
			</title>
			<meta name="robots" content="noindex, nofollow" />
			<meta
				name="description"
				content="Page de réinitialisation du mot de passe pour l'Atlas numérique des noms divins en Méditerranée."
			/>
			{/* Canonical URL */}
			<link
				rel="canonical"
				href={"https://dcart-map.huma-num.fr/#/forgot-password"}
			/>
		</Helmet>
	);
};

const ResetPasswordPageHelmetContent = () => {
	return (
		<Helmet>
			<title>
				Réinitialisation du mot de passe | Atlas numérique des noms divins en
				Méditerranée
			</title>
			<meta name="robots" content="noindex, nofollow" />
			<meta
				name="description"
				content="Page de réinitialisation du mot de passe pour l'Atlas numérique des noms divins en Méditerranée."
			/>
			{/* Canonical URL */}
			<link
				rel="canonical"
				href={"https://dcart-map.huma-num.fr/#/reset-password"}
			/>
		</Helmet>
	);
};

export {
	HomePageHelmetContent,
	TagPageHelmetContent,
	MapPageHelmetContent,
	StorymapPageHelmetContent,
	LegalNoticePageHelmetContent,
	NotFoundPageHelmetContent,
	AuthentificationPageHelmetContent,
	ForgotPasswordPageHelmetContent,
	ResetPasswordPageHelmetContent,
};
