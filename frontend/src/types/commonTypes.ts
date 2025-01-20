type NavList = {
	id: string;
	title: string;
	onClickFunction: undefined | (() => void);
	route: undefined | string;
}[];

export type { NavList };
