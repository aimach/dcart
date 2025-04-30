// import du style
import style from "./legalPage.module.scss";

const LegalNoticePage = () => {
	return (
		<div className={style.legalPage}>
			<h1>Mentions légales</h1>
			<p>Dernière mise à jour : 30 avril 2025</p>

			<h2>1. Éditeur du site</h2>
			<p>
				Ce site web est édité dans le cadre du projet dCART (des dieux à la
				carte,{" "}
				<a href="https://sms.univ-tlse2.fr/accueil-sms/la-recherche/operations-structurantes/dcart-des-dieux-a-la-carte">
					lien
				</a>
				), un projet de recherche financé par le LabEx SMS (Sociétés, Milieux,
				Santé).
				<br />
				Ce projet vise à diffuser les données et connaissances qui ont été
				produites dans le cadre du projet de recherche{" "}
				<a href="https://map-polytheisms.huma-num.fr/">ERC MAP</a>, à
				destination d'un public non spécialiste. Il mobilise les possibilités du
				web pour diffuser des contenus attractifs (Atlas numérique des noms
				divins en Méditerranée).
				<br />
			</p>
			<p>
				Nom de l’entreprise / Freelance : [Ton nom ou raison sociale] <br />
				Statut juridique : [ex : Entreprise individuelle] <br />
				Adresse : [adresse postale] <br />
				Email : [email] <br />
				Téléphone : [facultatif] <br />
				SIRET : [numéro SIRET] <br />
			</p>

			<h2>2. Responsable de la publication</h2>
			<p>[Ton nom complet ou celui du responsable légal]</p>

			<h2>3. Hébergement</h2>
			<p>
				Hébergeur : TGIR Huma-Num <br />
				Adresse : UMS 3598 54 Bd Raspail, 75006 Paris <br />
				Site :{" "}
				<a href="https://www.huma-num.fr/">Lien vers le site d'Huma-Num</a>
			</p>

			<h2>4. Propriété intellectuelle</h2>
			<p>
				Le contenu de ce site (textes, images, code, etc.) est protégé par le
				droit d’auteur. Toute reproduction ou utilisation sans autorisation est
				interdite.
			</p>

			<h2>5. Limitation de responsabilité</h2>
			<p>
				L’éditeur ne saurait être tenu responsable en cas de dommages liés à
				l’utilisation du site ou à des erreurs dans les contenus publiés.
			</p>
		</div>
	);
};

export default LegalNoticePage;
