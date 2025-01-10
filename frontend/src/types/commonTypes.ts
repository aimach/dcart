// import des types
import type { TranslationObject } from "./languageTypes";

type NavList = {
	title: string | TranslationObject;
	onClickFunction: undefined | (() => void);
	route: undefined | string;
}[];

export type { NavList };
