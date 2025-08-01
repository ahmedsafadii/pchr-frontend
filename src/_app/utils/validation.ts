// Palestinian ID validation utilities

/**
 * Palestinian ID Number Format:
 * - 9 digits total
 * - Common patterns start with specific prefixes
 * - Format: XXXXXXXXX (9 digits)
 */

export const PALESTINIAN_ID_REGEX = /^[0-9]{9}$/;

/**
 * Validates Palestinian ID number format
 * @param idNumber - The ID number to validate
 * @returns boolean - true if valid format
 */
export const validatePalestinianId = (idNumber: string): boolean => {
  // Remove any spaces or dashes
  const cleanId = idNumber.replace(/[\s-]/g, '');
  
  // Check if it matches 9-digit pattern
  if (!PALESTINIAN_ID_REGEX.test(cleanId)) {
    return false;
  }
  
  // Additional validation: cannot be all zeros or all same digits
  if (/^0{9}$/.test(cleanId) || /^(.)\1{8}$/.test(cleanId)) {
    return false;
  }
  
  return true;
};

/**
 * Gets the appropriate error message for invalid Palestinian ID
 * @param locale - The current locale (en/ar)
 * @returns string - The error message
 */
export const getPalestinianIdErrorMessage = (locale: string): string => {
  return locale === "ar" 
    ? "رقم الهوية الفلسطيني يجب أن يكون 9 أرقام بالضبط"
    : "Palestinian ID number must be exactly 9 digits";
};

/**
 * Gets the tooltip message for Palestinian ID format
 * @param locale - The current locale (en/ar)
 * @returns string - The tooltip message
 */
export const getPalestinianIdTooltip = (locale: string): string => {
  return locale === "ar"
    ? "رقم الهوية الفلسطيني يجب أن يكون 9 أرقام (مثال: 123456789)"
    : "Palestinian ID number must be 9 digits (example: 123456789)";
};

/**
 * Palestinian Phone Number Format:
 * - Must start with 059
 * - Followed by exactly 7 digits
 * - Total: 10 digits (059XXXXXXX)
 */

export const PALESTINIAN_PHONE_REGEX = /^[0-9]{7}$/;

/**
 * Validates Palestinian phone number format
 * @param phoneNumber - The phone number to validate
 * @returns boolean - true if valid format
 */
export const validatePalestinianPhone = (phoneNumber: string): boolean => {
  // Remove any spaces, dashes, or other formatting
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  // Check if it starts with 059 and has exactly 7 more digits
  if (!cleanPhone.startsWith('059')) {
    return false;
  }
  
  // Extract the part after 059 and validate it's exactly 7 digits
  const remainingDigits = cleanPhone.substring(3);
  return PALESTINIAN_PHONE_REGEX.test(remainingDigits);
};

/**
 * Gets the appropriate error message for invalid Palestinian phone
 * @param locale - The current locale (en/ar)
 * @returns string - The error message
 */
export const getPalestinianPhoneErrorMessage = (locale: string): string => {
  return locale === "ar" 
    ? "رقم الهاتف يجب أن يبدأ بـ 059 ويتبعه 7 أرقام"
    : "Phone number must start with 059 followed by 7 digits";
};

/**
 * Gets the tooltip message for Palestinian phone format
 * @param locale - The current locale (en/ar)
 * @returns string - The tooltip message
 */
export const getPalestinianPhoneTooltip = (locale: string): string => {
  return locale === "ar"
    ? "رقم الهاتف الفلسطيني يجب أن يبدأ بـ 059 (مثال: 0591234567)"
    : "Palestinian phone number must start with 059 (example: 0591234567)";
};