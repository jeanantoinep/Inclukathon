export interface IDatepicker {
	setDate?: Date;
	language: 'fr'; // mandatory to prevent omission
	format?: string; // default 'mm/dd/yyyy'
	startDate?: string | Date;
	endDate?: string | Date;
	todayBtn?: true | 'linked'; // default: false
	clearBtn?: true; // default: false
	keyboardNavigation?: false; // default: true
	forceParse?: false; // default: true
	calendarWeeks?: true; // default: false
	autoclose?: true; // default: false
	todayHighlight?: true; // default: false
	toggleActive?: true; // default: false
	multidate?: true; // default: false
	multidateSeparator?: string; // default: ','
	orientation?:
		| 'auto'
		| 'top auto'
		| 'bottom auto'
		| 'auto left'
		| 'auto right'
		| 'top left'
		| 'top right'
		| 'bottom left'
		| 'bottom right';
	weekStart?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
	daysOfWeekDisabled?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
	daysOfWeekHighlighted?: '0' | '1' | '2' | '3' | '4' | '5' | '6';
	minViewMode?: '0' | '1' | '2' | '3' | '4'; // 0 => day, 1 => month, 2 => year, 3 => decade, 4 => centuries
	maxViewMode?: '0' | '1' | '2' | '3' | '4'; // 0 => day, 1 => month, 2 => year, 3 => decade, 4 => centuries
	startView?: '0' | '1' | '2' | '3' | '4'; // 0 => day, 1 => month, 2 => year, 3 => decade, 4 => centuries
	datesDisabled?: string[];
	defaultViewDate?: {year: number; month: number; day: number};
	beforeShowDay?: (date: Date) => boolean | string | {tooltip?: string; classes?: string};
	beforeShowMonth?: (date: Date) => boolean | string | {tooltip?: string; classes?: string};
	beforeShowYear?: (date: Date) => boolean | string | {tooltip?: string; classes?: string};
}

export interface IEventDatepicker {
	date: Date;
	dates: Date[]; // when multidate is true only
	format: () => any /* a function to make formatting date easier. ix can be the index of a Date in the dates array to format; if absent, the last date selected will be used. format can be any format string that datepicker supports; if absent, the format set on the datepicker will be used. Both arguments are optional. */;
}
