const modalContentArray = [
	{
		title_fr: "Bienvenue sur le tutoriel de la carte",
		content_fr:
			"Ce tutoriel vous présente les principales fonctionnalités de la carte. Utilisez les boutons de navigation pour passer d'une étape à l'autre, et quittez le tutoriel à tout moment si vous le souhaitez.",
		title_en: "Welcome to the map tutorial",
		content_en:
			"This tutorial introduces the main features of the map. Use the navigation buttons to move through the steps, and feel free to exit the tutorial at any time.",
	},
	{
		title_fr: "La section carte",
		content_fr:
			"Cette section affiche les localités contenant des sources en lien avec le sujet de la carte. Cliquez sur les points pour accéder aux détails (statistiques, informations sur les sources). Si plusieurs points se superposent, vous pouvez les sélectionner pour consulter les données de chacun.",
		title_en: "The map section",
		content_en:
			"This section displays the localities that contain sources related to the topic of the map. Click on the points to access more details (source information, statistics). If multiple points overlap, you can select them to view the data for each one.",
	},
	{
		title_fr: "Informations de la carte en cours",
		content_fr:
			"Dans cet encart figurent le nom de la carte actuelle, un bouton d’accès aux informations d’introduction, un bouton pour revenir à l'état d'origine de la carte ainsi que la liste des filtres actuellement appliqués.",
		title_en: "Current map information",
		content_en:
			"This panel displays the name of the current map and includes a button to access detailed introductory information and a button to revert to the original state of the map. The list of active filters will also appear here.",
	},
	{
		title_fr: "Filtre temporel, fonds de carte et accessibilité",
		content_fr:
			"En bas de la carte, vous trouverez trois outils : un filtre temporel, une sélection de fonds de carte et la possibilité d'ajouter un filtre gris. Déplacez les curseurs sur la frise pour ajuster la période affichée. Changez de fond de carte pour varier la présentation des données.",
		title_en: "Time filter, basemaps, and accessibility",
		content_en:
			"At the bottom of the map, three tools are available: a time filter, a list of basemaps, and the option to add a gray filter. Drag the sliders on the timeline to adjust the displayed period. Change the basemap to vary the presentation of the data.",
	},
	{
		title_fr: "Le menu réduit",
		content_fr:
			"Lorsque le menu est replié, vous pouvez accéder rapidement aux fonctionnalités principales via les icônes, à ce tutoriel, ainsi qu'à l'impression de la carte.",
		title_en: "Collapsed menu",
		content_en:
			"When the menu is collapsed, you can quickly access the main features through the icons, this tutorial, as well as the map printing.",
	},
	{
		title_fr: "La liste des points affichés",
		content_fr:
			"L’onglet « Résultats » présente les points actuellement visibles sur la carte, classés par sous-région puis par lieu. Vous pouvez consulter le nombre de sources associées à chaque point, et cliquer dessus pour le localiser sur la carte.",
		title_en: "List of displayed points",
		content_en:
			"The 'Results' tab displays the points currently visible on the map, sorted by sub-region and then by place. You can see the number of sources associated with each point, and click on a point to locate it on the map.",
	},
	{
		title_fr: "Sélection d'un point",
		content_fr:
			"En cliquant sur un point (depuis la liste des résultats ou directement sur la carte), l’onglet « Sélection » s’ouvre. Il présente deux types d’informations : les statistiques et les sources liées à ce point, classées chronologiquement. Cliquer sur une source pour en voir les attestations.",
		title_en: "Point selection",
		content_en:
			"When you click on a point (either in the results list or on the map), the 'Selection' tab opens. It displays two types of data: statistics and the sources linked to that point, listed in chronological order. Click on a source to view its attestations.",
	},
	{
		title_fr: "Les filtres",
		content_fr:
			"Utilisez les filtres pour affiner les données affichées selon vos critères. Une fois appliqués, le rappel des filtres est visible dans l'encart d'informations de la carte. A savoir qu'une attestation est affichée si elle correspond à au moins une option de chaque filtre. Une fois les filtres appliqués, les filtres se mettent à jour selon les attestations visibles (les filtres qui ne donnent pas de résultats sont grisés).",
		title_en: "Filters",
		content_en:
			"Use filters to refine the displayed data according to your criteria. Once applied, the active filters are visible in the map information panel. Note that an attestation is displayed if it matches at least one option from each filter. After applying the filters, they will update based on the visible attestations (filters that do not give results are grayed out).",
	},
];

const mobileTutorialContent = {
	title_fr: "Bienvenue sur le tutoriel de la carte",
	title_en: "Welcome to the map tutorial",
	content_fr:
		"Cette carte interactive vous permet d’explorer les sources liées à la thématique de la carte. Vous pouvez zoomer, vous déplacer sur la carte et appuyer sur un point pour afficher ses informations détaillées dans un panneau latéral. Ce panneau comporte trois onglets : l'onglet 'Résultats' avec la liste des points affichés, classés par sous-région et lieu ; l'onglet 'Filtres' avec la possibilité d'ajouter des critères de tri et l'onglet 'Sélection' qui affiche les détails du point sélectionné (statistiques, sources, attestations liées). La fenêtre en haut à droite vous permet d'afficher l'introduction de la carte, de retourner à l'état initial de la carte, d'ouvrir le panneau latéral ou d'afficher ce tutoriel. Vous pouvez explorer librement la carte, filtrer les résultats, ou revenir à tout moment à cette aide depuis le menu.",

	content_en:
		"This interactive map allows you to explore sources related to the map's theme. You can zoom in, move around the map, and tap on a point to display its detailed information in a side panel. This panel has three tabs: the 'Results' tab with the list of displayed points, sorted by sub-region and place; the 'Filters' tab with the option to add sorting criteria; and the 'Selection' tab that shows the details of the selected point (statistics, sources, related attestations). The window in the top right allows you to display the map introduction, return to the initial state of the map, open the side panel, or display this tutorial. You can freely explore the map, filter the results, or return to this help at any time from the menu.",
};

export { modalContentArray, mobileTutorialContent };
