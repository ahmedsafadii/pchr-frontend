# Metadata System Documentation

## Overview

The PCHR frontend uses a comprehensive metadata system that supports internationalization and provides proper SEO optimization. The system automatically generates metadata based on the current locale and page content.

## Architecture

### Core Components

1. **`src/_app/utils/metadata.ts`** - Main metadata utility functions
2. **`src/_app/layout.tsx`** - Root layout with dynamic metadata generation
3. **Individual pages** - Page-specific metadata using the utility functions

### Key Features

- ✅ **Internationalization Support** - Automatically uses translated titles and descriptions
- ✅ **SEO Optimization** - Complete Open Graph, Twitter Cards, and meta tags
- ✅ **Dynamic Generation** - Metadata generated based on current locale
- ✅ **Page-Specific Customization** - Easy to customize metadata per page
- ✅ **Type Safety** - Full TypeScript support

## Usage

### Basic Page Metadata

For most pages, use the `generatePageMetadata` function:

```typescript
import { generatePageMetadata } from "../utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return generatePageMetadata(
    t("page.title"), // Page title
    t("page.description"), // Page description
    {
      url: "/page-path", // Optional: page URL
      keywords: ["keyword1", "keyword2"], // Optional: additional keywords
      image: "/custom-image.png", // Optional: custom image
    }
  );
}
```

### Advanced Metadata Configuration

For more control, use the `generateMetadata` function directly:

```typescript
import { generateMetadata } from "../utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return generateMetadata({
    title: t("custom.title"),
    description: t("custom.description"),
    keywords: ["custom", "keywords"],
    url: "/custom-path",
    locale: "ar", // Force specific locale
    image: "/custom-og-image.png",
  });
}
```

### Translation Keys

The system automatically uses these translation keys:

- `landing.title` - Default page title
- `landing.description` - Default page description
- `common.organizationName` - Organization name for branding

## Generated Metadata

The system automatically generates:

### Basic Meta Tags

- `<title>` - Dynamic title with template support
- `<meta name="description">` - Page description
- `<meta name="keywords">` - SEO keywords
- `<meta name="author">` - Author information
- `<meta name="robots">` - Search engine directives

### Open Graph Tags

- `og:type` - Website type
- `og:locale` - Locale (en_US or ar_PS)
- `og:url` - Canonical URL
- `og:site_name` - Site name
- `og:title` - Page title
- `og:description` - Page description
- `og:image` - Social sharing image

### Twitter Cards

- `twitter:card` - Card type (summary_large_image)
- `twitter:title` - Page title
- `twitter:description` - Page description
- `twitter:image` - Social sharing image

### Internationalization

- `hreflang` - Language alternatives
- `canonical` - Canonical URL

## Examples

### Landing Page

```typescript
// src/_app/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return generatePageMetadata(t("landing.title"), t("landing.description"), {
    url: "/",
    keywords: ["PCHR", "missing persons", "Gaza", "human rights"],
  });
}
```

### Case Tracking Page

```typescript
// src/_app/track/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return generatePageMetadata(t("track.title"), t("track.description"), {
    url: "/track",
    keywords: ["case tracking", "status", "PCHR"],
  });
}
```

### Lawyer Dashboard

```typescript
// src/_app/lawyer/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return generatePageMetadata(
    t("lawyer.dashboard.title"),
    t("lawyer.dashboard.description"),
    {
      url: "/lawyer",
      keywords: ["lawyer", "dashboard", "cases", "PCHR"],
    }
  );
}
```

## Configuration

### Base URL

Update the base URL in `src/_app/utils/metadata.ts`:

```typescript
const baseUrl = "https://your-domain.com";
```

### Default Images

Update default Open Graph and Twitter Card images:

```typescript
const defaultImage = "/img/your-og-image.png";
```

### Organization Information

Update organization details in translation files:

```json
{
  "common": {
    "organizationName": "Your Organization Name"
  }
}
```

## Best Practices

1. **Always use translations** - Never hardcode titles or descriptions
2. **Include relevant keywords** - Add page-specific keywords for better SEO
3. **Use descriptive URLs** - Include the page path in the URL parameter
4. **Optimize images** - Use high-quality images for social sharing (1200x630px)
5. **Test both languages** - Verify metadata works correctly in both English and Arabic

## Troubleshooting

### Common Issues

1. **Metadata not updating** - Ensure you're using `async` functions and `await getTranslations()`
2. **Wrong locale** - Check that the locale parameter is correctly set
3. **Missing translations** - Verify translation keys exist in both language files
4. **Image not loading** - Ensure image paths are correct and images exist

### Debugging

Use browser dev tools to inspect the generated `<head>` section and verify all meta tags are present and correct.

## Migration Guide

### From Static Metadata

**Before:**

```typescript
export const metadata: Metadata = {
  title: "Static Title",
  description: "Static description",
};
```

**After:**

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return generatePageMetadata(t("page.title"), t("page.description"));
}
```

### From Basic generateMetadata

**Before:**

```typescript
export function generateMetadata(): Metadata {
  const t = getTranslations();
  return {
    title: t("page.title"),
    description: t("page.description"),
  };
}
```

**After:**

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return generatePageMetadata(t("page.title"), t("page.description"));
}
```

## Future Enhancements

- [ ] Dynamic image generation based on page content
- [ ] Structured data (JSON-LD) support
- [ ] Advanced SEO analytics integration
- [ ] A/B testing for metadata optimization
