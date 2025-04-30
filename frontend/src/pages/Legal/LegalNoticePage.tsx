// import du style
import style from "./legalPage.module.scss";

const LegalNoticePage = () => {
	return (
		<div className={style.legalPage}>
			<h1>Mentions légales</h1>
			<p>Dernière mise à jour : 30 avril 2025</p>

			<h2>1. Éditeur du site</h2>
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
				Hébergeur : [Nom de l’hébergeur] <br />
				Adresse : [adresse de l’hébergeur] <br />
				Site : <a href="[lien vers site de l’hébergeur]">[lien]</a>
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
