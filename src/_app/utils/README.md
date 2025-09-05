# Date Utility Functions

This module provides date formatting utilities for the PCHR application, supporting both English and Arabic locales.

## Functions

### `formatDate(date, locale)`

Formats a date to the specified format:
- **English**: "01 Jan 2025"
- **Arabic**: "01 يناير 2025"

**Parameters:**
- `date`: Date to format (Date object or date string)
- `locale`: Locale to use for formatting ('ar')

**Returns:** Formatted date string

**Example:**
```typescript
import { formatDate } from '../utils/dateUtils';

const date = new Date('2025-01-15');
const arabicDate = formatDate(date, 'ar'); // "15 يناير 2025"
```

### `formatDateWithLocale(date, currentLocale)`

Convenience function for components that already have access to the current locale from `useLocale()` hook.

**Parameters:**
- `date`: Date to format (Date object or date string)
- `currentLocale`: Current locale from useLocale() hook

**Returns:** Formatted date string in the current locale

**Example:**
```typescript
import { useLocale } from "next-globe-gen";
import { formatDateWithLocale } from '../utils/dateUtils';

function MyComponent() {
  const currentLocale = useLocale();
  const date = new Date();
  
  return (
    <div>
      Today: {formatDateWithLocale(date, currentLocale)}
    </div>
  );
}
```

### `formatDateForDisplay(date)`

Formats a date for display in the current locale. This function defaults to English if locale cannot be determined.

**Parameters:**
- `date`: Date to format (Date object or date string)

**Returns:** Formatted date string

## Usage Examples

### Basic Usage
```typescript
import { formatDate } from '../utils/dateUtils';

// Format current date
const today = new Date();
const formattedToday = formatDate(today, 'ar'); // "15 ديسمبر 2024"

// Format from string
const dateString = '2025-03-20';
const formattedDate = formatDate(dateString, 'ar'); // "20 مارس 2025"
```

### In Components with Locale Context
```typescript
import { useLocale } from "next-globe-gen";
import { formatDateWithLocale } from '../utils/dateUtils';

function VisitCard({ visitDate }) {
  const locale = useLocale();
  
  return (
    <div>
      <span>Visit Date: {formatDateWithLocale(visitDate, locale)}</span>
    </div>
  );
}
```

### Error Handling
```typescript
import { formatDate } from '../utils/dateUtils';

try {
  const formattedDate = formatDate('invalid-date', 'ar');
} catch (error) {
  console.error('Invalid date provided:', error.message);
  // Handle invalid date gracefully
}
```

## Arabic Month Names

The Arabic month names used are:
- يناير (January)
- فبراير (February)
- مارس (March)
- أبريل (April)
- مايو (May)
- يونيو (June)
- يوليو (July)
- أغسطس (August)
- سبتمبر (September)
- أكتوبر (October)
- نوفمبر (November)
- ديسمبر (December)

## Notes

- All dates are formatted with zero-padded day numbers (01, 02, etc.)
- English month names are abbreviated (Jan, Feb, Mar, etc.)
- Arabic month names are written in full Arabic script
- The function handles both Date objects and date strings as input
- Invalid dates will throw an error that should be handled by the calling code
