# CalendarMonth

A Typescript class for generating data representing a calendar month, especially for display

## API

<details>

```ts
export type CalendarMonthSettings = {
   /*****
     Defaults to most recent setting, or if never set, current year
    *****/
   year?: number;

   /*****
    1 - 12. Defaults to most recent setting. If never set, and year is set to current
    year, is set to current month. Else, 1.
    If month is not within 1 - 12, month and year will be adjusted. I.E., if set to 0,
    month will be reset to 12 and year will be reset to previous year.
    *****/
   month?: number;

   /*****
    Defaults to most recent setting, or if never set, 1.
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
   get data(): CalendarMonthData;

   constructor(settings?: CalendarMonthSettings);

   set(settings?: CalendarMonthSettings): void;
}
```

</details>

## Usage Examples

<details>

```ts
// Instantiate without parameters, letting it default to current year and month:
let cm = new CalendarMonth();
const current = new Date();
console.log(cm.data.year === current.getFullYear() && cm.data.month === current.getMonth() + 1);
// true

cm = new CalendarMonth({ month: 1, year: 2023 });
console.log(cm.data);
/*****
 {
    year: 2023,
    month: 1,
    day: 1,
    weekBeginsOn: 1,
    weeks: [
       [30, 31, 1, 2, 3, 4, 5],
       [6, 7, 8, 9, 10, 11, 12],
       [13, 14, 15, 16, 17, 18, 19],
       [20, 21, 22, 23, 24, 25, 26],
       [27, 28, 29, 30, 31, 1, 2]
    ]
 }
 *****/

// Jump forward 60 days:
cm.set({ day: cm.data.day + 60 });
console.log(cm.data);
/*****
 {
    year: 2023,
    month: 3,
    day: 2,
    weekBeginsOn: 1,
    weeks: [
       [26, 27, 28, 1, 2,  3,  4],
       [5,  6,  7, 8, 9, 10, 11],
       [12, 13, 14, 15, 16, 17, 18],
       [19, 20, 21, 22, 23, 24, 25],
       [26, 27, 28, 29, 30, 31, 1]
    ]
 }
 *****/

// Change to August, and reset day to 1:
cm.set({ month: 8, day: 1 });
console.log(cm.data);
/*****
 {
   year: 2023,
   month: 8,
   day: 1,
   weekBeginsOn: 1,
   weeks: [
     [30, 31, 1, 2, 3, 4, 5],
     [6, 7, 8, 9, 10, 11, 12],
     [13, 14, 15, 16, 17, 18, 19],
     [20, 21, 22, 23, 24, 25, 26],
     [27, 28, 29, 30, 31, 1, 2]
   ]
 }
 *****/

// Set the weeks to begin on Monday:
cm.set({ weekBeginsOn: 2 });
console.log(cm.data.weeks);
/*****
 [
   [31, 1, 2, 3, 4, 5, 6],
   [7, 8, 9, 10, 11, 12, 13],
   [14, 15, 16, 17, 18, 19, 20],
   [21, 22, 23, 24, 25, 26, 27],
   [28, 29, 30, 31, 1, 2, 3]
 ]
 *****/

// Go to the next month:
cm.set({ month: cm.data.month + 1 });
console.log(cm.data);
/*****
 {
   year: 2023,
   month: 9,
   day: 1,
   weekBeginsOn: 2,
   weeks: [
     [28, 29, 30, 31, 1, 2, 3],
     [4, 5, 6, 7, 8, 9, 10],
     [11, 12, 13, 14, 15, 16, 17],
     [18, 19, 20, 21, 22, 23, 24],
     [25, 26, 27, 28, 29, 30, 1]
   ]
 }
 *****/

// Jump forward 4 months:
cm.set({ month: cm.data.month + 4 });
console.log(cm.data);
/*****
 {
   year: 2024,
   month: 1,
   day: 1,
   weekBeginsOn: 2,
   weeks: [
     [1, 2, 3, 4, 5, 6, 7],
     [8, 9, 10, 11, 12, 13, 14],
     [15, 16, 17, 18, 19, 20, 21],
     [22, 23, 24, 25, 26, 27, 28],
     [29, 30, 31, 1, 2, 3, 4]
   ]
 }
 *****/
```

</details>

## Loading

```js
import { CalendarMonth } from "@writetome51/calendar-month";
```
