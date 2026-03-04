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
      const previous = {
         month: this.__data.month,
         year: this.__data.year,
         weekBeginsOn: this.__data.weekBeginsOn,
      };
      const today = getTodaysDate();

      this.__data.year = Number.isInteger(year)
         ? year
         : Number.isInteger(this.__data.year)
         ? this.__data.year
         : today.year;
      this.__data.month = Number.isInteger(month)
         ? month
         : Number.isInteger(this.__data.month)
         ? this.__data.month
         : today.month;
      this.__data.day = Number.isInteger(day)
         ? day
         : Number.isInteger(this.__data.day)
         ? this.__data.day
         : this.__data.month === today.month && this.__data.year === today.year
         ? today.day
         : 1;

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

      if (
         this.__data.year !== previous.year ||
         this.__data.month !== previous.month ||
         this.__data.weekBeginsOn !== previous.weekBeginsOn
      ) {
         this.__data.weeks = GetWeeks.go(this.__data);
      }
   }
}
