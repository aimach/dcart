// import du style
import style from "./privacyPolicyPage.module.scss";

const PrivacyPolicyPage = () => {
	return (
		<div className={style.privacyPolicyPage}>
			<h1>Politique de confidentialité</h1>
			<p>Dernière mise à jour : 30 avril 2025</p>

			<h2>1. Données collectées</h2>
			<p>
				Ce site ne collecte pas de données personnelles lors de la navigation.
				Seuls les noms et prénoms des administrateurs sont enregistrés à des
				fins de gestion de l'accès à l'administration du site.
			</p>

			<h2>2. Finalité</h2>
			<p>
				Les données des administrateurs sont utilisées uniquement dans le cadre
				de la gestion technique du site.
			</p>

			<h2>3. Hébergement</h2>
			<p>
				Le site est hébergé par : [Nom de l’hébergeur, adresse, lien vers leur
				politique de confidentialité].
			</p>

			<h2>4. Cookies</h2>
			<p>
				Aucun cookie de suivi n’est utilisé. Seuls les cookies techniques
				nécessaires au bon fonctionnement du site peuvent être déposés.
			</p>

			<h2>5. Vos droits</h2>
			<p>
				Conformément au Règlement Général sur la Protection des Données (RGPD),
				vous pouvez demander l’accès, la rectification ou la suppression des
				données vous concernant en nous contactant à : [adresse email].
			</p>
		</div>
	);
};

export default PrivacyPolicyPage;
