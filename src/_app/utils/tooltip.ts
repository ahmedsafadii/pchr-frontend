// Tooltip utility for consistent styling across the app using react-tooltip

import { CSSProperties } from 'react';

/**
 * Default tooltip styles that match the app's design system
 */
export const defaultTooltipStyle: CSSProperties = {
  backgroundColor: '#1f2937', // gray-800
  color: 'white',
  borderRadius: '6px',
  fontSize: '12px',
  maxWidth: '250px',
  zIndex: 1000,
  padding: '8px 12px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

/**
 * Small tooltip variant
 */
export const smallTooltipStyle: CSSProperties = {
  ...defaultTooltipStyle,
  fontSize: '11px',
  padding: '6px 8px',
  maxWidth: '200px',
};

/**
 * Large tooltip variant
 */
export const largeTooltipStyle: CSSProperties = {
  ...defaultTooltipStyle,
  fontSize: '14px',
  padding: '12px 16px',
  maxWidth: '300px',
};

/**
 * Common tooltip props for consistency
 */
export const defaultTooltipProps = {
  place: 'top' as const,
  style: defaultTooltipStyle,
  delayShow: 300,
  delayHide: 100,
};

/**
 * Creates tooltip data attributes for an element
 * @param id - Unique tooltip ID
 * @param content - Tooltip content
 * @returns Object with data attributes
 */
export const createTooltipProps = (id: string, content: string) => ({
  'data-tooltip-id': id,
  'data-tooltip-content': content,
});

/**
 * Icon classes for tooltip triggers that match the design system
 */
export const tooltipIconClasses = 'ml-2 text-gray-500 hover:text-orange-600 transition-colors cursor-help inline-block';