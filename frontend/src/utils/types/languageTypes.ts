type Language = "en" | "fr";

type LanguageObject = {
	title: string;
	en: string;
	fr: string;
	navigation: {
		home: string;
		maps: string;
		storymaps: string;
		backoffice: string;
		translation: string;
		back: string;
		explore: string;
		discover: string;
	};
	alert: {
		maxReached: string;
	};
	button: {
		freeExploration: string;
		result: string;
		filters: string;
		filter: string;
		selection: string;
		seeSources: string;
		seeAll: string;
		epithet: string;
		gender: string;
		activity: string;
		doughnut: string;
		bar: string;
		resetFilter: string;
		discover: string;
		add: string;
	};
	common: {
		between: string;
		and: string;
		or: string;
		unknownDate: string;
		greek: string;
		semitic: string;
		previous: string;
		next: string;
		back: string;
		createdOn: string;
		updatedOn: string;
		lastUpdloadOn: string;
		by: string;
		after: string;
		before: string;
		in: string;
		map: string;
		storymap: string;
		published: string;
		noPublished: string;
	};
	modal: {
		firstContent: string;
		secondContent: string;
		chooseRegion: string;
		chooseDivinity: string;
		postDate: string;
		anteDate: string;
		yes: string;
		no: string;
		deleteBlockText: string;
		deteleStorymapText: string;
		deteleMapText: string;
	};
	mapPage: {
		introduction: string;
		noResult: string;
		enlargeYourSearch: string;
		noGreekOrSemitic: string;
		onlySemitic: string;
		onlyGreek: string;
		withElements: string;
		shape: {
			circle: string;
			square: string;
			triangle: string;
			diamond: string;
		};
		aside: {
			filters: string;
			sources: string;
			epithet: string;
			noFilter: string;
			location: string;
			element: string;
			language: string;
			seeStat: string;
			seeSources: string;
			searchForLocation: string;
			searchForElement: string;
			noSelectedMarker: string;
			traduction: string;
			originalVersion: string;
			agents: string;
			noAgent: string;
			noDesignation: string;
		};
	};
	backoffice: {
		createA: string;
		managementTable: {
			image: string;
			name: string;
			status: string;
			createdOn: string;
			updatedOn: string;
			lastUploadBy: string;
			links: string;
		};
		authPage: {
			login: string;
			username: string;
			password: string;
			requiredField: string;
		};
		mapFormPage: {
			aside: {
				informations: string;
				pointSets: string;
				filters: string;
			};
			pointSetTable: {
				name: string;
				color: string;
				icon: string;
				delete: string;
			};
			pointSetForm: {
				pointSetName: {
					label: string;
					description: string;
				};
				attestationIds: {
					label: string;
					description: string;
				};
				pointColor: {
					label: string;
					description: string;
				};
				pointIcon: {
					label: string;
					description: string;
				};
				chooseIcon: string;
				noDefinedColor: string;
				noDefinedIcon: string;
				isLayeredLabel: string;
				isNbDisplayedLabel: string;
			};
			addMapIntro: string;
			addMapPoints: string;
			uploadPoints: string;
			addFilters: string;
			filterIntroduction: string;
			locationFilter: { label: string; description: string };
			languageFilter: { label: string; description: string };
			epithetFilter: { label: string; description: string };
			noFilter: { label: string; description: string };
			create: string;
			edit: string;
			uploadPointsHelp: string;
		};
		storymapFormPage: {
			preview: string;
			chooseBlock: string;
			textContent: string;
			mediaContent: string;
			mapsContent: string;
			backToEdit: string;
			types: {
				title: string;
				subtitle: string;
				text: string;
				image: string;
				link: string;
				quote: string;
				layout: string;
				simple_map: string;
				comparison_map: string;
				scroll_map: string;
				separator: string;
				table: string;
			};
			form: {
				create: string;
				edit: string;
				title: string;
				subtitle: string;
				text: string;
				image: string;
				link: string;
				quote: string;
				layout: string;
				simple_map: string;
				comparison_map: string;
				scroll_map: string;
				separator: string;
				step: string;
				csv: string;
				forLeftPane: string;
				forRightPane: string;
				uploadTableFr: string;
				uploadTableEn: string;
				imageToLeft: string;
				imageToRight: string;
				scrollMapStepList: string;
				addStep: string;
				modifyStep: string;
			};
		};
	};
};

type TranslationType = {
	en: LanguageObject;
	fr: LanguageObject;
};

export type { Language, LanguageObject, TranslationType };
