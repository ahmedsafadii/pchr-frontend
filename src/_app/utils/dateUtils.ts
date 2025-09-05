/**
 * Date utility functions for formatting dates across the application
 */

/**
 * Formats a date to the specified format:
 * - Arabic: "01 يناير 2025"
 * 
 * @param date - Date to format (Date object or date string)
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();

  // Arabic month names (only supported language)
  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const monthName = arabicMonths[month];

  return `${day} ${monthName} ${year}`;
}

/**
 * Formats a date using the current locale from the app context
 * This is a convenience function for components that already have access to locale
 * 
 * @param date - Date to format (Date object or date string)
 * @returns Formatted date string
 */
export function formatDateWithLocale(date: Date | string): string {
  return formatDate(date);
}

/**
 * Formats a date for display in the current locale
 * This function can be used in components that don't have direct access to locale
 * 
 * @param date - Date to format (Date object or date string)
 * @returns Formatted date string in the current locale
 */
export function formatDateForDisplay(date: Date | string): string {
  // Format date in Arabic (only supported language)
  return formatDate(date);
}
