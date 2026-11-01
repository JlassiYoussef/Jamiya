# Changelog

All notable changes to this project. Newest at the top. Keep entries short and
human — one line per change. Based on [Keep a Changelog](https://keepachangelog.com).

Categories: **Added**, **Changed**, **Fixed**, **Removed**.

## [Unreleased]

### Added
- Initial project scaffold from the CS 488 starter template.
- Initial React/Vite frontend and NestJS API workspace scaffolds with Vitest and Jest smoke tests.
- Added the responsive, multilingual Jamiya dashboard prototype and interactive module views.
- Added association-scoped member CRUD, role-checked access, database-backed sign-in sessions, and an authenticated multilingual member screen.

### Changed
- Upgraded Prisma to version 7 and configured its PostgreSQL driver adapter.
- Run the database seed with `tsx` to resolve generated Prisma TypeScript modules correctly.

### Fixed
- Keep member forms scrollable when the dialog is taller than the viewport.

<!--
Example of a real entry once you start building:

## [Unreleased]

### Added
- Study-partner matching by course (#12)

### Fixed
- Crash when the search box was empty (#15)
-->
