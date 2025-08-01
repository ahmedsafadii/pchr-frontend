# Tooltip Usage Guide

This project uses the `react-tooltip` library for consistent, accessible tooltips throughout the application.

## Installation

The library is already installed:
```bash
npm install react-tooltip
```

## Quick Start

### 1. Basic Usage

```tsx
import { Tooltip } from "react-tooltip";
import { IconInfoCircle } from "@tabler/icons-react";
import { defaultTooltipProps, createTooltipProps, tooltipIconClasses } from "../utils/tooltip";

// Add tooltip to any element
<IconInfoCircle 
  size={16} 
  className={tooltipIconClasses}
  {...createTooltipProps("my-tooltip", "This is helpful information")}
/>

// Add the tooltip component (usually at the end of your component)
<Tooltip 
  id="my-tooltip"
  {...defaultTooltipProps}
/>
```

### 2. Using Utilities

The project provides utilities for consistent styling:

```tsx
import { 
  defaultTooltipProps,     // Standard tooltip configuration
  createTooltipProps,      // Helper for data attributes
  tooltipIconClasses,      // Consistent icon styling
  smallTooltipStyle,       // Small variant
  largeTooltipStyle        // Large variant
} from "../utils/tooltip";
```

### 3. Examples

#### Form Field Tooltip
```tsx
<label className="form-label">
  Field Name <span className="required">*</span>
  <IconInfoCircle 
    size={16} 
    className={tooltipIconClasses}
    {...createTooltipProps("field-help", "This field is required")}
  />
</label>
<Tooltip id="field-help" {...defaultTooltipProps} />
```

#### Button with Help
```tsx
<button 
  className="btn"
  {...createTooltipProps("save-help", "Click to save your progress")}
>
  Save
</button>
<Tooltip id="save-help" {...defaultTooltipProps} />
```

#### Custom Styled Tooltip
```tsx
import { smallTooltipStyle } from "../utils/tooltip";

<Tooltip 
  id="small-tooltip"
  place="right"
  style={smallTooltipStyle}
/>
```

## Available Styles

### Default Style
- Background: `#1f2937` (gray-800)
- Text: white
- Border radius: 6px
- Font size: 12px
- Max width: 250px

### Small Style
- Font size: 11px
- Padding: 6px 8px
- Max width: 200px

### Large Style
- Font size: 14px
- Padding: 12px 16px
- Max width: 300px

## Best Practices

1. **Unique IDs**: Always use unique tooltip IDs to avoid conflicts
2. **Consistent Styling**: Use the provided utilities for consistent appearance
3. **Accessible Icons**: Use `tooltipIconClasses` for proper hover states
4. **Meaningful Content**: Keep tooltip text concise and helpful
5. **Placement**: Use appropriate `place` prop (top, bottom, left, right)

## Common Patterns

### Form Field Validation (Current Usage)

#### ID Number Field
```tsx
<label className="steps__label">
  ID Number <span className="steps__required">*</span>
  <IconInfoCircle 
    size={16} 
    className={tooltipIconClasses}
    {...createTooltipProps("id-tooltip", "Palestinian ID must be 9 digits (example: 123456789)")}
  />
</label>
<Tooltip id="id-tooltip" {...defaultTooltipProps} />
```

#### Phone Number Field
```tsx
<label className="steps__label">
  Phone Number <span className="steps__required">*</span>
  <IconInfoCircle 
    size={16} 
    className={tooltipIconClasses}
    {...createTooltipProps("phone-tooltip", "Palestinian phone number must start with 059 (example: 0591234567)")}
  />
</label>
<Tooltip id="phone-tooltip" {...defaultTooltipProps} />
```

### Multiple Tooltips in One Component
```tsx
// Different IDs for each tooltip
<IconInfoCircle {...createTooltipProps("tooltip-1", "First tooltip")} />
<IconInfoCircle {...createTooltipProps("tooltip-2", "Second tooltip")} />

// Render all tooltips
<Tooltip id="tooltip-1" {...defaultTooltipProps} />
<Tooltip id="tooltip-2" {...defaultTooltipProps} />
```

## Props Reference

### Tooltip Component Props
- `id`: Unique identifier (required)
- `place`: Position ("top" | "bottom" | "left" | "right")
- `style`: Custom CSS styles
- `delayShow`: Show delay in ms
- `delayHide`: Hide delay in ms

### Element Data Attributes
- `data-tooltip-id`: Links to tooltip ID
- `data-tooltip-content`: Tooltip text content

## Migration from Custom Tooltip

If you have existing custom tooltips, replace them with:

```tsx
// Old custom tooltip
<div className="custom-tooltip">...</div>

// New react-tooltip
<IconInfoCircle {...createTooltipProps("new-tooltip", "Content")} />
<Tooltip id="new-tooltip" {...defaultTooltipProps} />
```