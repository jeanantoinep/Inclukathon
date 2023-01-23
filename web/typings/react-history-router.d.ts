interface IRouterProps {
	history?: History;
	location?: Location;
	match?: Match;
}

interface History {
	push: (url: string | HistoryPushParams) => any;
	goBack: () => void;
	location: Location;
}

interface Location {
	pathname: string;
	search: string;
}

interface Match {
	params: Params;
}

interface Params {
	[key: string]: string;
}

interface HistoryPushParams {
	pathname: string;
	state?: any;
	search?: string;
}
