# FusionPDF Workflow

## Index Page Redesign

- [x] **Review and Analyze**: Assessed the existing `index.html` and `styles.css` to identify areas for improvement.
- [x] **Propose New Layout**: Designed a new, modern layout using Bootstrap for a responsive and intuitive user experience.
- [x] **Implement Redesign**: Replaced the old `index.html` and `styles.css` with the new, redesigned versions.
- [x] **Add Bootstrap and Font Awesome**: Integrated Bootstrap 5 and Font Awesome to enhance the UI and provide better visual cues.
- [x] **Improve Navigation**: Added a fixed sidebar with scroll-spy for easy navigation.
- [x] **Refactor Code**: Cleaned up and reorganized JavaScript for better readability and maintainability.
- [x] **Test Functionality**: Ensured all PDF generation examples and event handlers are working correctly.
- [x] **Document Changes**: Updated `CHANGELOG.md` to reflect all the changes made during the redesign.

**Status**: The UI/UX redesign is complete and ready for review.

## Development Process

1.  **Branching**:
    *   `main`: Production-ready code.
    *   `develop`: Integration branch for features.
    *   `feature/<feature-name>`: For new features.
    *   `fix/<issue-id>`: For bug fixes.

2.  **Commits**:
    *   Follow conventional commit messages (e.g., `feat: add new chart generation`, `fix: resolve image rendering issue`).

3.  **Pull Requests (PRs)**:
    *   All changes to `develop` and `main` must go through PRs.
    *   PRs should be reviewed by at least one other developer (if applicable).
    *   Ensure all tests pass and linting is clean before merging.

4.  **Testing**:
    *   Unit tests for core logic in `src/core/`.
    *   Integration tests for jQuery plugin in `test/jquery/`.
    *   Manual testing using `test/jquery/basic.test.html` for UI interactions.

5.  **Documentation**:
    *   Update `README.md` with any API changes or new features.
    *   Keep `CHANGELOG.md` updated (can be automated with semantic-release later).
    *   Document code clearly with JSDoc comments for type hinting and API generation.

## Release Process (Future - using semantic-release)

1.  Merges to `main` will trigger an automated release process (via GitHub Actions).
2.  `semantic-release` will analyze commit messages to determine the next version number.
3.  A new version will be tagged, a GitHub release created, and the package published to npm.

## Issue Tracking

*   Use GitHub Issues for bug reports, feature requests, and task management.

## Code Style

*   Follow ESLint rules defined in `.eslintrc.js` (to be created).
*   Use Prettier for code formatting (to be configured).
