import { GetWeeks } from "./get-weeks";
import { getTodaysDate } from "./get-todays-date";
import { inRange } from "@writetome51/in-range";
import { not } from "@writetome51/not";

export type CalendarMonthSettings = {
   /*****
    Defaults to most recent setting, or if never set, current year
    *****/
   year?: number;

   /*****
    1 - 12. Defaults to most recent setting, or if never set, current month.
    If month is not within 1 - 12, month and year will be adjusted. I.E., if set to 0,
    month will be reset to 12 and year will be reset to previous year.
    *****/
   month?: number;

   /*****
    Defaults to most recent setting, or if never set, 1.
    If month or year is changed, day is reset to 1.
    If day is outside accepted range, month and/or year are adjusted.
    *****/
   day?: number;

   /*****
    1 - 7.  Defaults to most recent setting, or if never set, 1 (Sunday)
    *****/
   weekBeginsOn?: number;
};

export type CalendarMonthData = Required<CalendarMonthSettings> & {
   /*****
    * The numbers of each day in the set month, separated into the weeks of the month.
    * Includes days of previous and next months. I.E., This is a February whose first
    * day is a Wednesday (and the week begins on Sunday):
    *
    [
    [29,30,31,1,2,3,4],
    [5,6,7,8,9,10,11],
    [12,13,14,15,16,17,18],
    [19,20,21,22,23,24,25],
    [26,27,28,1,2,3,4]
    ]
    *****/
   weeks: ReadonlyArray<ReadonlyArray<number>>;
};

export class CalendarMonth {
   private __data: CalendarMonthData = {
      year: undefined,
      month: undefined,
      day: undefined,
      weekBeginsOn: undefined,
      weeks: undefined,
   };

   get data(): CalendarMonthData {
      return Object.freeze({ ...this.__data });
   }

   constructor(settings?: CalendarMonthSettings) {
      this.set(settings);
   }

   set(settings: CalendarMonthSettings = {}): void {
      const { year, month, day, weekBeginsOn } = settings;
      const today = getTodaysDate();
      const [yearIsInt, monthIsInt, dayIsInt]: [boolean, boolean, boolean] = [
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
