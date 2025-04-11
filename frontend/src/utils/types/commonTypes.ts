type NavList = {
	id: string;
	title: string | JSX.Element;
	description?: string;
	onClickFunction: undefined | (() => void);
	route: undefined | string;
	adminOnly?: boolean;
}[];

type OptionType = { value: number | string; label: string };

export type { NavList, OptionType };
