# Changelog

## [1.1.0] - 2024-07-17
### Added
- **Example 3: Full Page to PDF** integrated into `index.html`.
  - New sidebar navigation link.
  - HTML structure for a sample full-page report with styled header, content, table, and footer.
  - jQuery initialization for `fusionPDF` to generate PDF from the full page content.
  - CSS styles for the report layout added to `assets/css/styles.css`.

## [1.0.0] - 2024-07-17

### Added
- **UI/UX Redesign**: Overhauled the `index.html` page for a modern, intuitive, and responsive experience.
- **Bootstrap 5 Integration**: Replaced the previous basic layout with a robust, responsive grid system powered by Bootstrap 5.
- **Sidebar Navigation**: Implemented a fixed sidebar with scroll-spy functionality for easy navigation between sections.
- **Font Awesome Icons**: Added icons throughout the page to provide better visual cues and improve user engagement.
- **Structured Content**: Reorganized content into logical sections using cards and accordions for improved readability and clarity.
- **Enhanced User Feedback**: Maintained and improved user feedback using SweetAlert2 for a more interactive experience.

### Changed
- **CSS Overhaul**: Updated `assets/css/styles.css` to support the new Bootstrap layout, ensuring a consistent and modern design.
- **JavaScript Refactoring**: Reorganized and cleaned up the JavaScript code for better maintainability and clarity, including global event handlers for PDF generation.

### Fixed
- Resolved previous JavaScript errors caused by incomplete file updates, ensuring all scripts are now fully functional.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure for FusionPDF jQuery plugin.
- `fusionpdf.jquery.js` with basic plugin skeleton.
- `fusionpdf.jquery.d.ts` for TypeScript support.
- `basic.test.html` for manual jQuery plugin testing.
- `jquery.integration.spec.js` placeholder for automated tests.
- `package.json` with initial configuration.
- `README.md` with basic usage instructions.
- `WORKFLOW.md` outlining development processes.
- `CHANGELOG.md` (this file).
- `debuglog.md` for logging debug information.

### Changed

### Deprecated

### Removed

### Fixed

### Security
