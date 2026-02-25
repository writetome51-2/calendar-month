export const getTodaysDate = () => {
    const today = new Date(); // Initializes at machine's local time.
    return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
    };
};
