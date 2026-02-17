# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
