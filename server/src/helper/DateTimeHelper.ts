import {DateTime, Duration, Interval} from 'luxon';
import {IDatepicker} from '../../../web/typings/datepicker';

/**
 * To be used on back only or with a method date call toDateTime() first because dates are not luxon date on front side when they are called
 * by http request.
 */
export class DateTimeHelper {
	public static defaultDatePickerFormat = 'dd MM yyyy'; // => same as DateTime.DATE_FULL but for datepicker lib

	public static isBefore(date: DateTime, limiteDate: DateTime) {
		return date < limiteDate;
	}

	public static isAfter(date: DateTime, limiteDate: DateTime) {
		return date >= limiteDate;
	}

	public static isIn(current: DateTime, startDate: DateTime, endDate: DateTime): boolean {
		if (!current || !startDate || !endDate) {
			return null;
		}
		const currentWithoutTime = this.toDateWithoutTime(current);
		const startDateWithoutTime = this.toDateWithoutTime(startDate);
		const endDateWithoutTime = this.toDateWithoutTime(endDate);
		const interval = Interval.fromDateTimes(startDateWithoutTime, endDateWithoutTime);
		return interval.contains(currentWithoutTime);
	}

	public static formatWithDateOnly(date: DateTime, defaultFormat = DateTime.DATE_FULL) {
		return DateTimeHelper.toDateTime(date, true)?.toLocaleString(defaultFormat);
	}

	public static getSimpleDatepickerOptions(): IDatepicker {
		return {
			autoclose: true,
			language: 'fr',
			format: DateTimeHelper.defaultDatePickerFormat,
			todayHighlight: true,
			todayBtn: 'linked',
		};
	}

	// return human readable duration as day or minute if day < 1
	public static getDurationFormatted(dateTime: DateTime, otherDateTime: DateTime) {
		const a = DateTimeHelper.toDateWithoutTime(dateTime);
		const b = DateTimeHelper.toDateWithoutTime(otherDateTime);
		if (Math.abs(a.diff(b).as('day')) <= 0) {
			return Duration.fromObject({
				minutes: Math.abs(a.diff(b, 'minutes', {conversionAccuracy: 'casual'}).as('minutes')),
			}).toHuman();
		}
		return Duration.fromObject({
			days: Math.abs(a.diff(b, 'days', {conversionAccuracy: 'casual'}).as('days')),
		}).toHuman();
	}

	/**
	 * Suppress time part
	 */
	public static toDateWithoutTime(date: DateTime): DateTime {
		return DateTime.utc(date.get('year'), date.get('month'), date.get('day'), 0, 0, 0, 0);
	}

	/**
	 * tldr; any Date to js Date
	 * to be used ONLY when a lib work only with js date
	 */
	public static toJsDate(obj: any): Date {
		if (!obj) {
			return null;
		}
		return DateTimeHelper.toDateTime(obj).toJSDate();
	}

	/**
	 * tldr; any Date to Luxon DateTime
	 * Call this method if you have a date who isn't a luxon object
	 */
	public static toDateTime(obj: any, forceNoTime = false): DateTime {
		if (!obj) {
			return null;
		}
		if (typeof obj === 'string') {
			obj = new Date(obj);
		}
		if (DateTime.isDateTime(obj as DateTime)) {
			const dateTime = obj as DateTime;
			return forceNoTime ? DateTimeHelper.toDateWithoutTime(dateTime) : dateTime;
		}
		const nativeDate: Date = obj as Date;
		return DateTime.utc(
			nativeDate.getFullYear(),
			nativeDate.getMonth() + 1,
			nativeDate.getDate(),
			forceNoTime ? 0 : nativeDate.getHours(),
			forceNoTime ? 0 : nativeDate.getMinutes(),
			forceNoTime ? 0 : nativeDate.getSeconds(),
			forceNoTime ? 0 : nativeDate.getMilliseconds(),
		);
	}
}
