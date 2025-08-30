/**
 * Date utility functions for formatting dates across the application
 */

/**
 * Formats a date to the specified format:
 * - English: "01 Jan 2025"
 * - Arabic: "01 يناير 2025"
 * 
 * @param date - Date to format (Date object or date string)
 * @param locale - Locale to use for formatting ('en' or 'ar')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale: 'en' | 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();

  let monthName: string;

  if (locale === 'ar') {
    // Arabic month names
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    monthName = arabicMonths[month];
  } else {
    // English month names (abbreviated)
    const englishMonths = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    monthName = englishMonths[month];
  }

  return `${day} ${monthName} ${year}`;
}

/**
 * Formats a date using the current locale from the app context
 * This is a convenience function for components that already have access to locale
 * 
 * @param date - Date to format (Date object or date string)
 * @param currentLocale - Current locale from useLocale() hook
 * @returns Formatted date string
 */
export function formatDateWithLocale(date: Date | string, currentLocale: string): string {
  return formatDate(date, currentLocale as 'en' | 'ar');
}

/**
 * Formats a date for display in the current locale
 * This function can be used in components that don't have direct access to locale
 * 
 * @param date - Date to format (Date object or date string)
 * @returns Formatted date string in the current locale
 */
export function formatDateForDisplay(date: Date | string): string {
  // Default to English if locale cannot be determined
  // In practice, this should be called from components that have locale context
  return formatDate(date, 'en');
}
