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
     Defaults to most recent setting. If never set, and both month and year are set to
     current month and year, this is set to current day. Else is set to 1.
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

export declare class CalendarMonth {
    private __data;

    get data(): CalendarMonthData;

    constructor(settings?: CalendarMonthSettings);

    set(settings?: CalendarMonthSettings): void;
}
