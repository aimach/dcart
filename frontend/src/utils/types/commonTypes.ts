type NavList = {
	id: string;
	title: string;
	description?: string;
	onClickFunction: undefined | (() => void);
	route: undefined | string;
}[];

export type { NavList };
