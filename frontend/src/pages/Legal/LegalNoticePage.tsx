// import des composants
import { LegalNoticePageHelmetContent } from "../../components/helmet/HelmetContent";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import du style
import style from "./legalPage.module.scss";

const LegalNoticePage = () => {
	const { language } = useTranslation();
	return language === "fr" ? (
		<>
			<LegalNoticePageHelmetContent />
			<div className={style.legalPage}>
				<h1>Crédits et Mentions légales</h1>
				<p>Dernière mise à jour : 17 juillet 2025</p>
				<div className={style.paragraphContainer}>
					<h2>Informations éditoriales</h2>
					<p>
						Ce site web est édité dans le cadre du projet dCART (des dieux à la
						carte,{" "}
						<a href="https://sms.univ-tlse2.fr/accueil-sms/la-recherche/operations-structurantes/dcart-des-dieux-a-la-carte">
							lien
						</a>
						), un projet de recherche financé par le LabEx SMS (Strucutration
						des Mondes Sociaux). Ce projet vise à diffuser les données et
						connaissances qui ont été produites dans le cadre du projet de
						recherche{" "}
						<a href="https://base-map-polytheisms.huma-num.fr/">ERC MAP</a>, à
						destination d'un public non spécialiste. Il mobilise les
						possibilités du web pour diffuser des contenus attractifs (Atlas
						numérique des noms divins en Méditerranée).
						<br />
					</p>
					<p>
						<h3>Directeurs de publication</h3>
						<p>Corinne Bonnet, Laurent Jégou, Sylvain Lebreton</p>
					</p>
				</div>
				<div className={style.paragraphContainer}>
					<h2>Création, réalisation et hébergement du site</h2>
					<p>
						<h3>Conception du site</h3>
						Marie-Hermine Schneider <br />
						Conception graphique et ergonomique, intégration et développement
						<br />
						<br />
						<a
							href="https://github.com/aimach"
							target="_blank"
							rel="noreferrer"
						>
							github.com/aimach
						</a>
						<br />
					</p>
					<p>
						<h3>Crédits images, multimédia</h3>
						Photos : Credits indicated on the respective pages <br />
						Vidéos : crédits mentionnés dans les pages
					</p>
					<p>
						<h3>Hébergement</h3>
						<a href="https://www.huma-num.fr/" target="_blank" rel="noreferrer">
							TGIR Huma-Num
						</a>
					</p>
				</div>

				<div className={style.paragraphContainer}>
					<h2>Traitement de données à caractère personnel</h2>
					<p>
						L’équipe du site https://dcart-map.huma-num.fr/ est particulièrement
						attentive à la protection des données à caractère personnel. <br />
						https://dcart-map.huma-num.fr/ s’engage à mettre en œuvre les
						mesures adéquates à la protection, la confidentialité et la sécurité
						des Données Personnelles conformément à la réglementation en vigueur
						en France et dans l’Union Européenne, en particulier au Règlement
						Général sur la Protection des Données Personnelles UE 2016/679 du 27
						avril 2016 et aux règles de droit national prises pour son
						application.
						<br />
						Pour toute information complémentaire sur la protection des données
						personnelles, nous vous invitons à consulter le site :
						<a href="https://www.cnil.fr/" target="_blank" rel="noreferrer">
							www.cnil.fr
						</a>
						<br />
					</p>
					<p>
						<h3>Collecte et origine des données</h3>
						<p>
							Via le site web, nous traitons des données à caractère personnel
							qui vous concernent. Nous considérons que ces données proviennent
							directement de vous-même. Dans tous les cas, vous êtes informés
							des finalités pour lesquelles vos données sont collectées par nos
							soins via les différents formulaires de collecte de données en
							ligne ou bien encore via notre Politique des cookies. Vos données
							à caractère personnel collectées sur ce site sont traitées
							conformément aux finalités prévues lors de la collecte, dans le
							respect du RGPD et des lignes directrices de la CNIL.
						</p>
					</p>
					<p>
						<h3>Finalités de traitement et bases légales</h3>
						<h4>Connexion au site internet</h4>
						<p>
							Lorsque vous vous connectez à notre site, certaines données
							personnelles peuvent être traitées dans le cadre de cette
							activité, notamment pour : <br />- permettre l’accès à votre
							compte utilisateur ;<br />- garantir la sécurité de
							l’authentification et de la session ;<br />- vous fournir des
							services personnalisés liés à votre profil. <br />
							Le traitement se base sur l’exécution du contrat (accès à votre
							espace personnel) et, le cas échéant, sur notre intérêt légitime à
							assurer la sécurité de notre site.
							<br />
							Vous pouvez, à tout moment, demander :<br /> - la modification de
							vos données liées à votre compte (nom, email), <br /> - la
							suppression complète de votre compte, entraînant l’effacement de
							vos données personnelles associées, sauf obligation légale de
							conservation.
						</p>

						<h4>Publications</h4>
						<p>
							Lorsque vous publiez une carte ou une storymap via notre site,
							certaines données personnelles peuvent être rendues publiques,
							notamment votre nom et prénom, en tant qu’auteur ou autrice.
							<br />
							Ces données sont traitées dans le but de : <br />- afficher
							l’auteur de la carte publiée <br />- valoriser la contribution
							individuelle des utilisateurs <br />- assurer la traçabilité
							éditoriale des contenus proposés sur la plateforme
							<br />
							<br />
							Le traitement repose sur votre consentement, donné au moment de la
							création de la carte ou storymap. Vous pouvez, à tout moment,
							demander :<br /> - la modification de vos données affichées,{" "}
							<br />- leur suppression si vous ne souhaitez plus qu’elles soient
							visibles publiquement.
						</p>
					</p>
					<div className={style.paragraphContainer}>
						<h2>Cookies</h2>
						<p>
							Les « cookies » (ou témoins de connexion) sont des petits fichiers
							texte de taille limitée qui nous permettent de reconnaître votre
							ordinateur, votre tablette ou votre mobile aux fins de
							personnaliser les services que nous vous proposons.
						</p>
						<p>
							Nous utilisons uniquement des cookies strictement nécessaires au
							bon fonctionnement du site. Aucun cookie publicitaire ou de mesure
							d’audience n’est utilisé.
						</p>
						<h4>Cookie d'authentification</h4>
						<p>
							Lors de la connexion à votre espace personnel, un cookie est créé
							afin de stocker un jeton d’authentification. Ce cookie permet de
							maintenir votre session active et sécurisée. Ce cookie : <br />-
							est essentiel pour le fonctionnement du système de connexion ;
							<br />- est stocké localement dans votre navigateur sous forme
							sécurisée ; <br /> - n’est jamais utilisé à des fins publicitaires
							ou de suivi de navigation.
							<br />
							<br />
							Le fondement légal de ce traitement repose sur l’exécution du
							contrat (accès à votre compte) et sur notre intérêt légitime à
							garantir la sécurité des connexions.
						</p>
						<p>
							La plupart des navigateurs Internet sont configurés par défaut de
							façon que le dépôt de cookies soit autorisé. Votre navigateur vous
							offre l’opportunité de modifier ces paramètres standards de
							manière que l’ensemble des cookies soit rejeté systématiquement ou
							bien à ce qu’une partie seulement des cookies soit acceptée ou
							refusée en fonction de leur émetteur.
						</p>
					</div>
					<div className={style.paragraphContainer}>
						<h2>Loi applicable</h2>
						<p>
							Les présentes conditions d’utilisation du site sont régies par la
							loi française et soumises à la compétence des tribunaux du siège
							social de l’éditeur, sous réserve d’une attribution de compétence
							spécifique découlant d’un texte de loi ou réglementaire
							particulier.
						</p>
					</div>
				</div>
			</div>
		</>
	) : (
		<>
			<LegalNoticePageHelmetContent />
			<div className={style.legalPage}>
				<h1>Credits and Legal Notice</h1>
				<p>Last updated: July 17, 2025</p>
				<div className={style.paragraphContainer}>
					<h2>Editorial Information</h2>
					<p>
						This website is published as part of the dCART project (des dieux à
						la carte,{" "}
						<a href="https://sms.univ-tlse2.fr/accueil-sms/la-recherche/operations-structurantes/dcart-des-dieux-a-la-carte">
							link
						</a>
						), a research project funded by LabEx SMS (Structuring of Social
						Worlds). The aim of this project is to disseminate the data and
						knowledge produced within the{" "}
						<a href="https://base-map-polytheisms.huma-num.fr/">ERC MAP</a>{" "}
						research project to a non-specialist audience. It harnesses the
						possibilities of the web to share engaging content (Digital Atlas of
						Divine Names in the Mediterranean).
						<br />
					</p>
					<p>
						<h3>Publication Directors</h3>
						<p>Corinne Bonnet, Laurent Jégou, Sylvain Lebreton</p>
					</p>
				</div>
				<div className={style.paragraphContainer}>
					<h2>Site Design, Development, and Hosting</h2>
					<p>
						<h3>Website Design</h3>
						Marie-Hermine Schneider <br />
						Graphic and ergonomic design, integration, and development
						<br />
						<br />
						<a
							href="https://github.com/aimach"
							target="_blank"
							rel="noreferrer"
						>
							github.com/aimach
						</a>
						<br />
					</p>
					<p>
						<h3>Image and Multimedia Credits</h3>
						Photos : credits indicated on the respective pages <br />
						Vidéos : credits indicated on the respective pages
					</p>
					<p>
						<h3>Hosting</h3>
						<a href="https://www.huma-num.fr/" target="_blank" rel="noreferrer">
							TGIR Huma-Num
						</a>
					</p>
				</div>

				<div className={style.paragraphContainer}>
					<h2>Personal Data Processing</h2>
					<p>
						The team behind the website
						<a href="https://dcart-map.huma-num.fr/">
							https://dcart-map.huma-num.fr/
						</a>
						is particularly attentive to the protection of personal data. <br />
						<a href="https://dcart-map.huma-num.fr/">
							https://dcart-map.huma-num.fr/
						</a>
						is committed to implementing appropriate measures to ensure the
						protection, confidentiality, and security of Personal Data in
						accordance with the applicable regulations in France and the
						European Union, in particular the General Data Protection Regulation
						(EU) 2016/679 of April 27, 2016, and the national legal provisions
						adopted for its implementation. <br /> For more information on
						personal data protection, we invite you to visit the following
						website:
						<a href="https://www.cnil.fr/" target="_blank" rel="noreferrer">
							www.cnil.fr
						</a>
						<br />
					</p>
					<p>
						<h3>Data Collection and Origin</h3>
						<p>
							Through this website, we process personal data concerning you. We
							consider that this data originates directly from you. In all
							cases, you are informed of the purposes for which your data is
							collected by us, either via the various online data collection
							forms or through our Cookie Policy. <br /> The personal data
							collected on this site is processed in accordance with the
							purposes defined at the time of collection, in compliance with the
							GDPR and the guidelines of the CNIL.
						</p>
					</p>
					<p>
						<h3>Purposes of Processing and Legal Bases</h3>
						<h4>Website Login</h4>
						<p>
							When you log in to our website, certain personal data may be
							processed as part of this activity, particularly in order to:
							<br />– allow access to your user account; <br />– ensure secure
							authentication and session management; <br />– provide you with
							personalized services related to your profile. <br /> Processing
							is based on the performance of a contract (access to your personal
							space) and, where applicable, on our legitimate interest in
							ensuring the security of our website. <br /> You may, at any time,
							request: <br />– the modification of your account data (name,
							email); <br />– the complete deletion of your account, which will
							result in the erasure of your associated personal data, unless
							legal obligations require retention.
						</p>
						<h4>Publications</h4>
						<p>
							Lorsque vous publiez une carte ou une storymap via notre site,
							certaines données personnelles peuvent être rendues publiques,
							notamment votre nom et prénom, en tant qu’auteur ou autrice.
							<br />
							Ces données sont traitées dans le but de : <br />- afficher
							l’auteur de la carte publiée <br />- valoriser la contribution
							individuelle des utilisateurs <br />- assurer la traçabilité
							éditoriale des contenus proposés sur la plateforme
							<br />
							<br />
							Le traitement repose sur votre consentement, donné au moment de la
							création de la carte ou storymap. Vous pouvez, à tout moment,
							demander :<br /> - la modification de vos données affichées,
							<br />- leur suppression si vous ne souhaitez plus qu’elles soient
							visibles publiquement.
						</p>
					</p>
					<div className={style.paragraphContainer}>
						<h2>Cookies</h2>
						<p>
							“Cookies” are small text files of limited size that allow us to
							recognize your computer, tablet, or mobile device in order to
							personalize the services we offer you.
						</p>
						<p>
							We only use cookies that are strictly necessary for the proper
							functioning of the website. No advertising or audience measurement
							cookies are used.
						</p>
						<h4>Authentication Cookie</h4>
						<p>
							When you log in to your personal space, a cookie is created to
							store an authentication token. This cookie keeps your session
							active and secure. This cookie: <br />– is essential for the login
							system to function properly; <br />– is stored locally in your
							browser in a secure format; <br />– is never used for advertising
							or tracking purposes. <br />
							<br /> The legal basis for this processing is the performance of a
							contract (access to your account) and our legitimate interest in
							ensuring secure connections.
						</p>
						<p>
							Most web browsers are set by default to allow the placement of
							cookies. Your browser gives you the option to change these default
							settings so that all cookies are rejected systematically, or only
							certain cookies are accepted or rejected depending on their
							source.
						</p>
					</div>
					<div className={style.paragraphContainer}>
						<h2>Applicable Law</h2>
						<p>
							These terms of use are governed by French law and fall under the
							jurisdiction of the courts located at the publisher’s registered
							office, subject to any specific jurisdiction assigned by a
							particular legal or regulatory provision.
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default LegalNoticePage;
