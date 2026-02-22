import { GetNumDaysInMonth } from "./get-num-days-in-month.js";
import { getRoundedUp } from "@writetome51/get-rounded-up-down";
import { getArrFilled } from "@writetome51/get-arr-filled";
import { getPage } from "@writetome51/array-get-page";
export class GetWeeks {
    static go(settings) {
        let vars = this.__getVariables(settings);
        const daysToDisplay = [
            ...this.__getDaysOfPreviousMonth(vars),
            ...this.__getDaysOfMonth(vars),
            ...this.__getDaysOfNextMonth(vars),
        ];
        return this.__getDaysSeparatedAsWeeks(Object.assign(Object.assign({}, vars), { daysToDisplay }));
    }
    static __getVariables(settings) {
        const numDaysInMonth = GetNumDaysInMonth.go(settings);
        const weekdayIndexOfFirstDay = this.__getWeekdayIndexOfFirstDay(settings);
        return Object.assign(Object.assign({}, settings), { weekdayIndexOfFirstDay,
            numDaysInMonth, numWeeks: getRoundedUp((numDaysInMonth + weekdayIndexOfFirstDay) / 7) });
    }
    static __getWeekdayIndexOfFirstDay({ month, year, weekBeginsOn }) {
        let index = new Date(year, month - 1, 1).getDay() - (weekBeginsOn - 1);
        if (index < 0)
            index += 7;
        return index;
    }
    static __getDaysOfPreviousMonth({ month, year, weekdayIndexOfFirstDay }) {
        const numDaysInPreviousMonth = GetNumDaysInMonth.go({
            month: month - 1,
            year,
        });
        return getArrFilled(weekdayIndexOfFirstDay, (i) => numDaysInPreviousMonth - (weekdayIndexOfFirstDay - 1) + i);
    }
    static __getDaysOfNextMonth({ numWeeks, weekdayIndexOfFirstDay, numDaysInMonth }) {
        const numRemainingDays = numWeeks * 7 - weekdayIndexOfFirstDay - numDaysInMonth;
        return getArrFilled(numRemainingDays, (i) => i + 1);
    }
    static __getDaysOfMonth({ numDaysInMonth }) {
        return getArrFilled(numDaysInMonth, (i) => i + 1);
    }
    static __getDaysSeparatedAsWeeks({ daysToDisplay, numWeeks, }) {
        return Object.freeze(getArrFilled(numWeeks, (i) => Object.freeze(getPage(i + 1, 7, daysToDisplay))));
    }
}
