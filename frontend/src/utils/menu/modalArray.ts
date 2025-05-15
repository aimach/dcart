const modalContentArray = [
	{
		title_fr: "Bienvenue sur le tutoriel de la carte",
		content_fr:
			"L'objectif de ce tutoriel est de vous montrer les fonctionnalités de la carte. Vous pouvez passer les étapes avec les boutons de navigation et quitter le tutoriel dès que vous le souhaitez.",
		title_en: "Welcome to the map tutorial",
		content_en:
			"The goal of this tutorial is to show you the features of the map. You can go through the steps using the navigation buttons and exit the tutorial at any time.",
	},
	{
		title_fr: "La section carte",
		content_fr:
			"Cette section vous présente les localités où se trouvent des sources relatives au sujet de la carte. Vous pouvez cliquer sur les points pour obtenir plus d'informations : accès au détail des sources, statistiques... Si des points d'un jeu de données se superposent, vous pouvez les sélectionner pour voir les informations de chaque point.",
		title_en: "The map section",
		content_en:
			"This section shows you the localities where sources related to the topic of the map are located. You can click on the points to get more information: access to source details, statistics, and more. If multiple data points overlap, you can select them to view information for each point.",
	},
	{
		title_fr: "Informations de la carte en cours",
		content_fr:
			"Dans cet encart, vous trouverez le nom de la carte et un bouton pour accéder aux informations détaillées présentées en introduction. La liste des filtres seront également affichés ici.",
		title_en: "Current map information",
		content_en:
			"This panel displays the name of the current map and includes a button to access detailed introductory information. The list of active filters will also appear here.",
	},
	{
		title_fr: "Filtre du temps et fonds de carte",
		content_fr:
			"La partie inférieure de la carte deux outils : un filtre temporel et une liste de fonds de carte disponbiles. Faites glisser les points sur la règle pour réduire la fenêtre temporelle. Vous pouvez choisir un fond de carte différent pour explorer les données sous différents angles.",
		title_en: "Time filter and basemaps",
		content_en:
			"The bottom of the map provides two tools: a time filter and a list of available basemaps. Drag the markers on the timeline to narrow the time window. You can also switch basemaps to explore the data from different perspectives.",
	},
	{
		title_fr: "Le menu réduit",
		content_fr:
			"Lorsque le menu est réduit, vous pouvez accéder rapidement aux fonctions principales via les icônes, ainsi qu'à ce tutoriel.",
		title_en: "Collapsed menu",
		content_en:
			"When the menu is collapsed, you can quickly access the main features through the icons, as well as this tutorial.",
	},
	{
		title_fr: "La liste des points affichés",
		content_fr:
			"L'onglet 'Résultats' vous permet de visualiser les points affichés sur la carte. Ils sont classés par ordre alphabétique de sous-région puis de lieu. Vous pouvez voir le nombre de sources associées à chaque point. Cliquez sur un point pour le sélectionner sur la carte.",
		title_en: "List of displayed points",
		content_en:
			"The 'Results' tab allows you to view the points displayed on the map. They are sorted alphabetically by sub-region and then by place. You can see the number of sources associated with each point. Click on a point to select it on the map.",
	},
	{
		title_fr: "La sélection d'un point",
		content_fr:
			"Lorsque vous cliquez sur un point dans la liste des résultats ou sur la carte, l'onglet 'Sélection' s'ouvre avec deux types de données : les statistiques et les sources associées au point sélectionné. Les sources sont classées par ordre chronologique. Pour chaque source, vous aurez accès à la liste des attestations.",
		title_en: "Point selection",
		content_en:
			"When you click on a point in the results list or on the map, the 'Selection' tab opens with two types of data: statistics and the sources associated with the selected point. The sources are listed in chronological order, and for each source, you can access the list of attestations.",
	},
	{
		title_fr: "Les filtres",
		content_fr:
			"Utilisez les filtres pour affiner les données affichées sur la carte selon vos critères. Il existe plusieurs types de filtre : par langue, par localité, par épithète...",
		title_en: "Filters",
		content_en:
			"Use the filters to refine the data displayed on the map according to your criteria. Several types of filters are available: by language, locality, epithet, and more.",
	},
];

const mobileTutorialContent = {
	title_fr: "Bienvenue sur le tutoriel de la carte",
	title_en: "Welcome to the map tutorial",
	content_fr:
		"Ce court tutoriel vous présente les fonctionnalités de la carte : en version mobile, vous pouvez visualiser les points sur la carte, zoomer et cliquer sur un point pour voir le détail des informations. Pour ouvrir le panel latéral, cliquer sur l'icône entre l'icône d'information et celle du tutorial. Vous accéderez aux onglets 'Résultats', 'Filtres' et 'Sélection'. ",
	content_en:
		"This short tutorial presents the features of the map : in mobile versino, you can view the points on the mpa, zoom in and click on a point to see the details. To open the lateral panel, click on icon between the information icon and the tutorial icon. You will access the 'Results', 'Filters' and 'Selection' tabs.",
};

export { modalContentArray, mobileTutorialContent };
