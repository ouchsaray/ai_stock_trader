// Utility for generating date ranges for stock API calls

/**
 * Format a Date object as YYYY-MM-DD
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

/**
 * Get the date N days ago as a formatted string
 * @param {number} n - Number of days ago
 * @returns {string} - Formatted date string (YYYY-MM-DD)
 */
export function getDateNDaysAgo(n) {
    const now = new Date(); // current date and time
    now.setDate(now.getDate() - n); // subtract n days
    return formatDate(now);
}

// Pre-computed date range for API calls
export const dates = {
    startDate: getDateNDaysAgo(3), // alter days to increase/decrease data set
    endDate: getDateNDaysAgo(1) // leave at 1 to get yesterday's data
}
