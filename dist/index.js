import { GetWeeks } from "./get-weeks.js";
import { getTodaysDate } from "./get-todays-date.js";
import { inRange } from "@writetome51/in-range";
import { not } from "@writetome51/not";
export class CalendarMonth {
    get data() {
        return Object.freeze(Object.assign({}, this.__data));
    }
    constructor(settings) {
        this.__data = {
            year: undefined,
            month: undefined,
            day: undefined,
            weekBeginsOn: undefined,
            weeks: undefined,
        };
        this.set(settings);
    }
    set(settings = {}) {
        const { year, month, day, weekBeginsOn } = settings;
        const today = getTodaysDate();
        const [yearIsInt, monthIsInt, dayIsInt] = [
            Number.isInteger(year),
            Number.isInteger(month),
            Number.isInteger(day),
        ];
        this.__data.day = dayIsInt ? day : this.__data.day;
        if (!this.__data.day || yearIsInt || monthIsInt) {
            this.__data.day = 1;
        }
        this.__data.year = yearIsInt
            ? year
            : Number.isInteger(this.__data.year)
                ? this.__data.year
                : today.year;
        this.__data.month = monthIsInt
            ? month
            : Number.isInteger(this.__data.month)
                ? this.__data.month
                : today.month;
        // If any values overflow, adjustments are made here
        const date = new Date(this.__data.year, this.__data.month - 1, this.__data.day);
        this.__data.year = date.getFullYear();
        this.__data.month = date.getMonth() + 1;
        this.__data.day = date.getDate();
        this.__data.weekBeginsOn = Number.isInteger(weekBeginsOn)
            ? weekBeginsOn
            : this.__data.weekBeginsOn || 1;
        if (not(inRange([1, 7], this.__data.weekBeginsOn))) {
            throw new Error(`'weekBeginsOn' must be integer from 1 to 7`);
        }
        this.__data.weeks = GetWeeks.go(this.__data);
    }
}
//
