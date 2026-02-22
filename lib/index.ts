import { GetWeeks } from "./get-weeks";
import { getTodaysDate } from "./get-todays-date";
import { inRange } from "@writetome51/in-range";
import { not } from "@writetome51/not";
import { getRoundedDown } from "@writetome51/get-rounded-up-down";

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
    1 - 7.  Defaults to most recent setting, or if never set, 1 (Sunday)
    *****/
   weekBeginsOn?: number;
};

export type CalendarMonthData = Required<CalendarMonthSettings> & {
   /*****
    * The numbers of each day in the set month, separated into the weeks of the month.
    * Includes days of previous and next months. I.E., This is a February whose first
    * day is a Wednesday (and the week begins on Sunday):
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
      const { year, month, weekBeginsOn } = settings;
      const today = getTodaysDate();

      this.__data.year = year || this.__data.year || today.year;
      this.__data.month = Number.isInteger(month) ? month : this.__data.month || today.month;

      this.__data.weekBeginsOn = Number.isInteger(weekBeginsOn)
         ? weekBeginsOn
         : this.__data.weekBeginsOn || 1;

      if (not(inRange([1, 7], this.__data.weekBeginsOn))) {
         throw new Error(`'weekBeginsOn' must be integer from 1 to 7`);
      }

      if (not(inRange([1, 12], this.__data.month))) {
         // adjust month and year
         let numYearsToAdd = getRoundedDown(this.__data.month / 12);
         if (numYearsToAdd === 0) numYearsToAdd = -1;
         const monthReference = numYearsToAdd < 0 ? 12 : 0;
         this.__data.month = monthReference + (this.__data.month % 12);
         this.__data.year += numYearsToAdd;
      }

      this.__data.weeks = GetWeeks.go(this.__data);
   }
}
