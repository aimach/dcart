type Language = "en" | "fr";

type LanguageObject = {
	title: string;
	homeDescription: string;
	en: string;
	fr: string;
	noAuthInMobile: string;
	invalidAuth: string;
	seeAlso: string;
	allRightsReserved: string;
	noPageFound: string;
	navigation: {
		home: string;
		maps: string;
		storymaps: string;
		backoffice: string;
		texts: string;
		back: string;
		explore: string;
		discover: string;
		users: string;
		tags: string;
		divinities: string;
		website: string;
		legalNotice: string;
	};
	alert: {
		maxReached: string;
		noTagAssociated: string;
		missingTranslation: string;
		copied: string;
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
		divinity: string;
		gender: string;
		activity: string;
		doughnut: string;
		bar: string;
		resetFilter: string;
		discover: string;
		add: string;
		save: string;
		delete: string;
		edit: string;
		cancel: string;
		publish: string;
		unpublish: string;
		editDisabled: string;
		search: string;
		copyRequest: string;
		myCreations: string;
		allCreations: string;
		leftSide: string;
		rightSide: string;
	};
	common: {
		between: string;
		and: string;
		or: string;
		to: string;
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
		close: string;
		typeOf: string;
		noData: string;
		no: string;
		filter: string;
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
		deleteUserText: { another: string };
		modifyUserStatusText: string;
		cleanPointSetText: string;
		deleteTagText: string;
		associatedStorymap: string;
		associatedMap: string;
	};
	menu: {
		content: string;
	};
	mapPage: {
		introduction: string;
		noResult: string;
		enlargeYourSearch: string;
		noGreekOrSemitic: string;
		noGreek: string;
		noSemitic: string;
		withElements: string;
		withElementsNb: string;
		withStatus: string;
		withAgentivities: string;
		withSourceMaterials: string;
		withAgentActivities: string;
		gender: string;
		aside: {
			filters: string;
			sources: string;
			epithet: string;
			noFilter: string;
			location: string;
			element: string;
			language: string;
			divinityNb: string;
			sourceType: string;
			agentActivity: string;
			agentGender: string;
			agentStatus: string;
			agentivity: string;
			sourceMaterial: string;
			male: string;
			female: string;
			nonBinary: string;
			timeLimits: string;
			seeStat: string;
			seeSources: string;
			filterIntroduction: string;
			searchForLocation: string;
			searchForElement: string;
			searchForSourceType: string;
			searchForAgentActivity: string;
			searchForAgentStatus: string;
			searchForSourceMaterial: string;
			searchForAgentivity: string;
			searchForAgentName: string;
			searchForTag: string;
			noSelectedMarker: string;
			traduction: string;
			originalVersion: string;
			agents: string;
			noAgent: string;
			noDesignation: string;
			noSourceMaterialDefined: string;
			introContent: string;
			dontShowAgain: string;
		};
	};
	backoffice: {
		createA: string;
		stillConnected: string;
		disconnectInOneMinute: string;
		managementTable: {
			image: string;
			name: string;
			status: string;
			createdOn: string;
			createdBy: string;
			updatedOn: string;
			lastUploadBy: string;
			links: string;
		};
		authPage: {
			login: string;
			username: string;
			password: string;
			requiredField: string;
			forgotPassword: string;
			enterEmail: string;
			sendResetLink: string;
			newPassword: string;
			saveNewPassword: string;
		};
		mapFormPage: {
			intro: {
				tags: { label: string; description: string; placeholder: string };
				divinityInChart: {
					label: string;
					description: string;
					checkbox: {
						divinity: string;
						epithet: string;
					};
				};
			};
			aside: {
				informations: string;
				pointSets: string;
				filters: string;
			};
			pointSetTable: {
				nameLang1: string;
				nameLang2: string;
				color: string;
				icon: string;
				delete: string;
				lastActivity: string;
				downloadCSV: string;
				downloadBDDCSV: string;
				downloadCustomCSV: string;
			};
			pointSetForm: {
				addNewPointSet: string;
				pointSetName: {
					label_fr: string;
					description_fr: string;
					label_en: string;
					description_en: string;
				};
				attestationIds: {
					label: string;
					description: string;
				};
				customPointsFile: {
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
				chooseColor: string;
				noDefinedColor: string;
				noDefinedIcon: string;
				isLayeredLabel: string;
				isNbDisplayedLabel: string;
			};
			filterForm: {
				element: {
					title: string;
					firstLevel: string;
					secondLevel: string;
					basic: { label: string; description: string };
					manual: { label: string; description: string };
				};
				location: {
					title: string;
					greatRegion: {
						label: string;
						description: string;
					};
					subRegion: {
						label: string;
						description: string;
					};
					cityName: {
						label: string;
						description: string;
					};
				};
			};
			addMapIntro: string;
			addMapPoints: string;
			uploadPoints: string;
			addFilters: string;
			filterIntroduction: string;
			locationFilter: { label: string; description: string };
			languageFilter: { label: string; description: string };
			epithetFilter: { label: string; description: string };
			divinityNbFilter: { label: string; description: string };
			sourceTypeFilter: { label: string; description: string };
			agentActivityFilter: { label: string; description: string };
			agentNameFilter: { label: string; description: string };
			agentGenderFilter: { label: string; description: string };
			agentStatusFilter: { label: string; description: string };
			agentivityFilter: { label: string; description: string };
			sourceMaterialFilter: { label: string; description: string };
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
				itemLink: string;
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
				headerPosition: string;
				headerPositionTop: string;
				headerPositionLeft: string;
				imageToLeft: string;
				imageToRight: string;
				scrollMapStepList: string;
				goToSteps: string;
				addTheStep: string;
				addAStep: string;
				modifyStep: string;
				modifyTextNow: string;
				modifyImageNow: string;
				tags: {
					label: string;
					description: string;
					placeholder: string;
				};
				fileStatus: {
					loadedFile: string;
					noFile: string;
					fileAlreadyLoaded: string;
				};
			};
		};
		userManagement: {
			title: string;
			username: string;
			pseudo: string;
			status: string;
			links: string;
			toAuthor: string;
			toAdmin: string;
			admin: string;
			writer: string;
			addUser: string;
			passwordManagementMessage: string;
		};
		translationManagement: {
			frenchTranslation: string;
			englishTranslation: string;
			"homepage.atitle": string;
			"homepage.description": string;
			"menu.description": string;
			"mapPage.introContent": string;
		};
		tagManagement: {
			title: string;
			createTag: string;
		};
	};
};

type TranslationType = {
	en: LanguageObject;
	fr: LanguageObject;
};

type TranslationObjectType = {
	id: string;
	fr: string;
	en: string;
	key: string;
	appLink?: string | null;
};

export type {
	Language,
	LanguageObject,
	TranslationType,
	TranslationObjectType,
};
