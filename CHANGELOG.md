# [1.4.0] - 2026-03-08

### Added
- **Automatic version injection**: Docs and public app now display the version from package.json, updated on every build.
- **Husky pre-commit hook**: Runs build and docs build automatically before every commit.
- **Build script for public/app.js**: Injects version into the footer at build time.

### Changed
- Server and docs version display is now fully automated and always up-to-date.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-02-26

### Added
- **Vite build system** - Modern build tooling with HMR and optimized production builds
- **Turndown as npm dependency** - Fully bundled, no CDN dependency
- **ESLint + Prettier** - Code quality and formatting with 4-space indentation for all TypeScript files
- **Mocha test framework** - 24 tests in 10 describe blocks
- **GitHub Actions CI/CD** - Automated linting and testing

### Changed
- **Yarn package manager** - Switched from npm
- Migrated docs build to Vite with new `build:docs` and `dev:docs` scripts
- Browser application moved to `browser-src/` with ES module imports
- Improved type safety in Turndown rules

### Removed
- Custom build scripts (`build-browser.ts`, `build.test.ts`, `tsconfig.browser.json`)
- Unused `jsdom` dependency

## [1.2.0] - 2026-02-17

### Added
- **Table support** - Converts HTML tables to Markdown table syntax
  - Automatic detection of table headers (th elements) with proper separator rows
  - Support for tables with and without headers
  - Handles empty cells gracefully
  - Escapes pipe characters (|) in cell content to prevent table formatting issues
  - Normalizes tables with varying column counts across rows
  - Column alignment and padding for readable output
  - Support for Confluence table structures (confluenceTable, confluenceTh, confluenceTd classes)
  - Handles multiline content in cells (converts to single line with spaces)
  - Support for tables with thead/tbody elements
  - Compatible with tables from Confluence, Google Docs, Word, and other rich text sources
- Added 9 comprehensive unit tests for table conversion functionality

### Fixed
- **Static version (GitHub Pages)** - Fixed browser compatibility issues
  - Created browser-compatible consolidated rules bundle (`docs/turndownRules.js`)
  - Fixed script loading path from `../lib/turndownRules.js` to `turndownRules.js`
  - Included all conversion rules (code blocks, inline code, tasks, lists, and tables) in browser bundle
  - Removed Node.js-specific `require()` statements for browser compatibility

## [1.1.1] - 2026-02-17

### Fixed
- **Confluence list items with paragraphs** - Removed unnecessary blank lines between list items
  - Added `confluenceListItem` rule to handle Confluence list items containing `<p>` tags with `data-renderer-start-pos` attribute
  - Prevents double newlines that were appearing between list items in Confluence exports
  - Preserves inline formatting (bold, italic, etc.) within list items
  - Does not interfere with existing task list (checkbox) functionality
- Added 6 comprehensive unit tests for the new list item handling

## [1.1.0] - 2026-02-17

### Added
- **Confluence code snippet support** - Converts Confluence code blocks to Markdown
  - Language detection from `data-code-lang` attribute (JavaScript, Python, Java, TypeScript, SQL, Bash, etc.)
  - Support for multiple Confluence code block classes: `code-block`, `codeBlock`, `ak-renderer-code-block`, `codeContent`, `syntaxhighlighter`
  - Support for DIV, PRE, and SPAN elements with code-related attributes
  - Support for modern Confluence SPAN-based code blocks with `data-ds--code--code-block` attribute
  - Proper newline preservation for Confluence line-structured code blocks
  - Automatic line number removal from Confluence code blocks (line numbers stripped from output)
  - Inline code conversion with support for `code`, `monospace` classes and `data-inline-code` attributes
  - **Known limitation:** Indentation may not be fully preserved (HTML parser collapses whitespace in inline elements)
- Comprehensive test suite with 20 new tests for code snippet functionality
- Documentation updates in README.md and lib/README.md
- **Modular rule structure** - Rules organized in separate files in `lib/rules/` folder

### Changed
- Enhanced `turndownRules.js` with two new rules: `confluenceCodeBlock` and `confluenceCodeSpan`
- Improved code block detection to handle various Confluence HTML structures including modern SPAN-based blocks
- Added intelligent line-by-line extraction for Confluence code blocks with `data-testid` line elements
- Added intelligent line number stripping for cleaner code output
- **Refactored rules into separate files** for better maintainability

## [1.0.0] - Previous Release

### Added
- Initial release with HTML to Markdown conversion
- Confluence task list support with checkboxes
- Nested list indentation handling
- Express server for local conversion
- Browser-based version for GitHub Pages deployment
- Turndown integration for HTML to Markdown conversion
- Modern, responsive UI
- Copy to clipboard functionality
