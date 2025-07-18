# PCHR Missing Person Report Platform

A comprehensive web platform for PCHR to manage missing person reports and case tracking.

## Project Overview

The PCHR Missing Person Report Platform is designed to help families and individuals report missing persons and track the progress of their cases through a secure, user-friendly interface. The platform connects families with legal professionals and provides real-time updates on case status.

## Core Modules

### 1. Landing Page
- **Home Page**: Main entry point with clear call-to-action buttons
- **Platform Description**: Information about PCHR's mission and services
- **Report New Case**: Direct link to open a new missing person case
- **Track Case**: Quick access to case tracking functionality
- **Lawyer Login**: Secure portal for legal professionals

### 2. Open a Case
- **Step-by-Step Wizard**: The process of opening a new case is guided by a 6-step wizard to ensure all necessary information is collected accurately and efficiently:
  1. **Detainee Information**: Collect basic identity and status of the missing person.
  2. **Detention/Disappearance Info**: Record where, when, and how the person went missing.
  3. **Client Info**: Capture who is reporting the case.
  4. **Documents Upload**: Ensure identity validation and legal handling by uploading relevant documents.
  5. **Delegation & Communication**: Understand any prior efforts made and contact preferences.
  6. **Consent and Submission**: Obtain legal authorization and submit the case.
- **After Submission**: Upon completing the application, the user will receive a case reference number and a link to the case tracking page. The user can use their mobile number and the case reference number to track the status and progress of their case.

### 3. Case Tracking
- **Access**: Users can track their case by entering their mobile number and case reference number in a simple form.
- **Case Summary & Status**: After logging in, users see a summary of their case, including the current status and key details.
- **Files & Documents**: All documents and files attached to the case are available for download and review.
- **Chat with Lawyer**: Users can communicate directly with the lawyer assigned to their case through a chat box, with support for sending and receiving attachments.
- **View Full Case Information**: A dedicated button allows users to view all detailed information related to their case.

### 4. Lawyer Portal
- **Login**: Secure login page accessible only to authorized lawyers.
- **Dashboard**: Overview dashboard displaying key statistics such as open, completed, and pending cases.
- **Calendar**: Integrated calendar showing upcoming visits and appointments.
- **Newest Assigned Cases**: List of the most recently assigned cases for quick access.
- **All Cases Table**: Comprehensive table of all cases assigned to the lawyer, with filtering and search capabilities.
- **Case Management Features**:
  - View detailed case information
  - Chat with clients and upload files
  - Request or cancel visits
  - Change the status of a case (e.g., pending, in progress, completed, released, etc.)
  - Manage and review all case-related documents

## Technical Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Font**: Geist (Sans & Mono)
- **Development**: Turbopack for fast development

## HTML & CSS Standards: Semantic HTML and BEM

To ensure our codebase is clean, maintainable, and accessible, we follow these standards for writing HTML and CSS:

### 1. Semantic HTML
- **Use semantic tags**: Always use the most appropriate HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, etc.) instead of generic `<div>` or `<span>` where possible.
- **Accessibility**: Use ARIA roles and attributes only when necessary. Prefer native HTML semantics for accessibility.
- **Minimal nesting**: Avoid unnecessary wrapper elements. Keep the DOM tree as flat and meaningful as possible.
- **Descriptive structure**: Organize content logically, reflecting the information hierarchy.

### 2. BEM (Block Element Modifier) Methodology
- **Class naming**: Use the BEM convention for all CSS class names:
  - `block` — The standalone entity (e.g., `case-summary`)
  - `block__element` — A part of the block that has no standalone meaning (e.g., `case-summary__title`)
  - `block--modifier` — A different state or variation of the block (e.g., `case-summary--highlighted`)
- **No camelCase or snake_case**: Use only lowercase and hyphens (`-`) to separate words.
- **No tag or id selectors**: Style only via classes, not by tag or id selectors.
- **Example:**
  ```html
  <section class="case-summary case-summary--highlighted">
    <h2 class="case-summary__title">Case Title</h2>
    <p class="case-summary__description">Description here...</p>
  </section>
  ```
- **Utility classes**: For one-off utilities (e.g., margin, padding), prefer Tailwind CSS utility classes. Use BEM for custom components and layouts.

### 3. Clean & Minimal Markup
- **Remove unused classes and elements**
- **Avoid inline styles**: Use Tailwind or BEM classes instead
- **Keep HTML readable**: Indent properly and use meaningful class names

**Reference:**
- [HTML5 Element Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [BEM Methodology](http://getbem.com/introduction/)

---

## Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd pchr-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
pchr-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Home layout (default, for landing page)
│   │   ├── page.tsx                  # Home page (/)
│   │   ├── track/
│   │   │   ├── layout.tsx            # Tracking layout (for /track/*)
│   │   │   ├── page.tsx              # Track form page (/track)
│   │   │   └── [caseId]/
│   │   │       ├── overview.tsx      # Case overview & chat (/track/[caseId]/overview)
│   │   │       └── details.tsx       # Case details (/track/[caseId]/details)
│   │   ├── lawyer/
│   │   │   ├── layout.tsx            # Lawyer dashboard layout (for /lawyer/*)
│   │   │   ├── login/
│   │   │   │   ├── layout.tsx        # Blank layout for login page
│   │   │   │   └── page.tsx          # Lawyer login page (/lawyer/login)
│   │   │   ├── dashboard.tsx         # Lawyer dashboard (/lawyer/dashboard)
│   │   │   ├── cases/
│   │   │   │   ├── page.tsx          # All cases (/lawyer/cases)
│   │   │   │   └── [caseId]/
│   │   │   │       ├── details.tsx   # Case details (/lawyer/cases/[caseId]/details)
│   │   │   │       ├── visits.tsx    # Case visits (/lawyer/cases/[caseId]/visits)
│   │   │   │       ├── messages.tsx  # Case messages (/lawyer/cases/[caseId]/messages)
│   │   │   │       └── files.tsx     # Case files (/lawyer/cases/[caseId]/files)
│   ├── css/
│   │   ├── global.css                # Design system, variables, base styles, resets, themes, etc.
│   │   ├── home.css                  # Home page specific styles
│   │   ├── track.css                 # Tracking module specific styles
│   │   └── lawyer.css                # Lawyer module specific styles
│   └── i18n/
│       ├── en/                       # English translations
│       │   └── ...
│       └── ar/                       # Arabic translations
│           └── ...
```

## Implementation Plan

1. **Directory & Routing Setup**
   - Create the folder structure as above for clear separation of modules and layouts.
   - Use Next.js App Router's nested layouts for home, tracking, lawyer, and blank layouts for login/forms.

2. **Design System & Styling**
   - Place all design tokens, variables, and shared base styles in `css/global.css`.
   - Use `css/home.css`, `css/track.css`, and `css/lawyer.css` for module-specific styles, imported in their respective layouts or pages.
   - Support light/dark mode globally via `global.css`, with module overrides as needed.

3. **Language Support (i18n)**
   - Add `i18n/` folder with subfolders for each supported language (e.g., `en/`, `ar/`).
   - Store translation files per module for easy maintenance and scalability.
   - Integrate language switcher in layouts as needed.

4. **Module Development**
   - **Home Page**: Minimal, fast, uses global design system and `home.css`.
   - **Track Module**: Includes form, overview, chat, and details pages. Uses its own layout and `track.css`.
   - **Lawyer Module**: Includes login (blank layout), dashboard, all cases, case details, visits, messages, and files. Uses its own layout and `lawyer.css`. All pages except login are protected by authentication/authorization middleware.

5. **Security & Performance**
   - Guard all `/lawyer/*` routes (except `/lawyer/login`) with authentication.
   - Use code splitting and lazy loading for module performance.
   - Minimize shared state; use context only for global needs (user, theme, i18n).

6. **Addons & Features**
   - Design system, light/dark mode, and multi-language support (EN/AR) are integrated from the start.

---

This plan ensures a scalable, maintainable, and high-performance codebase with clear separation of concerns, robust internationalization, and a strong foundation for future growth.

## Development Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Features to Implement

### Phase 1: Core Infrastructure
- [ ] User authentication system
- [ ] Database setup and models
- [ ] Basic routing structure
- [ ] Form components and validation

### Phase 2: Case Management
- [ ] Case creation workflow
- [ ] Document upload system
- [ ] Case tracking interface
- [ ] Status management system

### Phase 3: Lawyer Portal
- [ ] Lawyer authentication and dashboard
- [ ] Case assignment system
- [ ] Communication system
- [ ] Document management

### Phase 4: Advanced Features
- [ ] Real-time notifications
- [ ] Analytics and reporting
- [ ] Mobile responsiveness
- [ ] Security enhancements

## Addons & Features
- **Design System**: A comprehensive design system is defined and used throughout the platform for consistent UI/UX.
- **Light/Dark Mode**: The platform supports both light and dark themes for better accessibility and user preference.
- **Multi-Language Support**: The platform is available in both Arabic (AR) and English (EN), allowing users to switch languages as needed.

## Contributing

This project is maintained by the PCHR NGO team. Please follow the established coding standards and contribute through proper channels.

## License

This project is proprietary and confidential. All rights reserved by PCHR NGO.

---

**Last Updated**: [Current Date]
**Version**: 0.1.0
**Status**: Development Phase
