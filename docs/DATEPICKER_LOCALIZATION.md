# DatePicker Arabic Localization

This document explains how to use the new `LocalizedDatePicker` component that automatically handles Arabic localization throughout the app.

## Overview

The `LocalizedDatePicker` is a wrapper around `react-datepicker` that automatically:
- Detects the current locale using `useLocale()` from `next-globe-gen`
- Applies Arabic localization when `locale === "ar"`
- Sets appropriate calendar start day (Sunday for Arabic, Monday for English)
- Configures month/year dropdowns for better UX
- Handles RTL placement for Arabic

## Usage

### Basic Usage

Replace your existing `DatePicker` imports and usage:

```tsx
// Before
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

<DatePicker
  selected={date}
  onChange={handleChange}
  dateFormat="dd/MM/yyyy"
  // ... other props
/>

// After
import LocalizedDatePicker from "../../components/LocalizedDatePicker";

<LocalizedDatePicker
  selected={date}
  onChange={handleChange}
  dateFormat="dd/MM/yyyy"
  // ... other props (no need for locale-related props)
/>
```

### Props

The `LocalizedDatePicker` accepts all the same props as the original `DatePicker` except for `locale`, which is handled automatically.

**Note:** You don't need to pass `locale`, `calendarStartDay`, `showMonthDropdown`, `showYearDropdown`, or `dropdownMode` as these are automatically configured based on the current locale.

### Automatic Features

When the locale is Arabic (`ar`):
- Calendar starts from Sunday (weekStartsOn: 6)
- Month and year names are displayed in Arabic
- Calendar placement is optimized for RTL (`bottom-end`)
- Enhanced dropdown navigation for month/year selection

When the locale is English (`en`):
- Calendar starts from Monday (weekStartsOn: 0)
- Standard English display
- Calendar placement is optimized for LTR (`bottom-start`)

## Files Updated

The following files have been updated to use `LocalizedDatePicker`:

1. **`src/_app/new/steps/step1.tsx`** - Date of birth field
2. **`src/_app/new/steps/step2.tsx`** - Disappearance date field  
3. **`src/_app/new/steps/step4.tsx`** - Delegation date field
4. **`src/_app/components/modals/RequestVisitModal.tsx`** - Visit date field

## Implementation Details

The component automatically:
- Registers the Arabic locale (`ar-SA`) from `date-fns` when first imported
- Uses `useLocale()` hook to detect current locale
- Applies locale-specific configurations
- Maintains all existing functionality while adding localization

## Benefits

1. **Automatic Localization**: No need to manually pass locale props
2. **Consistent Behavior**: All DatePickers in the app behave the same way
3. **Easy Maintenance**: Single component to update for localization changes
4. **Better UX**: Arabic users get a properly localized date picker experience
5. **RTL Support**: Automatic right-to-left placement for Arabic locale

## Future Enhancements

- Add support for additional locales if needed
- Customizable date formats per locale
- Localized placeholder text support
- Additional RTL optimizations
