import { getRoundedUp } from "@writetome51/get-rounded-up-down";
import { getArrFilled } from "@writetome51/get-arr-filled";
import { getPage } from "@writetome51/array-get-page";
import { CalendarMonthSettings } from "./index";

export class GetWeeks {
   static go(settings: Required<CalendarMonthSettings>): ReadonlyArray<ReadonlyArray<number>> {
      let vars = this.__getVariables(settings);

      const daysToDisplay = [
         ...this.__getDaysOfPreviousMonth(vars),
         ...this.__getDaysOfMonth(vars),
         ...this.__getDaysOfNextMonth(vars),
      ];

      return this.__getDaysSeparatedAsWeeks({ ...vars, daysToDisplay });
   }

   private static __getVariables(
      settings: Required<CalendarMonthSettings>
   ): { month; year; weekBeginsOn; weekdayIndexOfFirstDay; numDaysInMonth; numWeeks } {
      const numDaysInMonth = this.__getNumDaysInMonth(settings);
      const weekdayIndexOfFirstDay = this.__getWeekdayIndexOfFirstDay(settings);

      return {
         ...settings,
         weekdayIndexOfFirstDay,
         numDaysInMonth,
         numWeeks: getRoundedUp((numDaysInMonth + weekdayIndexOfFirstDay) / 7),
      };
   }

   private static __getWeekdayIndexOfFirstDay({ month, year, weekBeginsOn }) {
      let index = new Date(year, month - 1, 1).getDay() - (weekBeginsOn - 1);
      if (index < 0) index += 7;

      return index;
   }

   private static __getDaysOfPreviousMonth({ month, year, weekdayIndexOfFirstDay }) {
      const numDaysInPreviousMonth = this.__getNumDaysInMonth({ year, month: month - 1 });
      return getArrFilled(
         weekdayIndexOfFirstDay,
         (i) => numDaysInPreviousMonth - (weekdayIndexOfFirstDay - 1) + i
      );
   }

   private static __getDaysOfNextMonth({ numWeeks, weekdayIndexOfFirstDay, numDaysInMonth }) {
      const numRemainingDays = numWeeks * 7 - weekdayIndexOfFirstDay - numDaysInMonth;
      return getArrFilled(numRemainingDays, (i) => i + 1);
   }

   private static __getDaysOfMonth({ numDaysInMonth }) {
      return getArrFilled(numDaysInMonth, (i) => i + 1);
   }

   private static __getDaysSeparatedAsWeeks({
      daysToDisplay,
      numWeeks,
   }): ReadonlyArray<ReadonlyArray<number>> {
      return Object.freeze(
         getArrFilled(
            numWeeks,
            (i) => Object.freeze(getPage(i + 1, 7, daysToDisplay)) as ReadonlyArray<number>
         )
      );
   }

   // given month (January is 1).
   private static __getNumDaysInMonth({ year, month }): number {
      // Day 0 of the next month is the last day of the current month
      return new Date(year, month, 0).getDate();
   }
}
