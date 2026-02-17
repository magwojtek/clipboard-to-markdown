# Clipboard to Markdown Converter

A simple local web application that converts HTML from your clipboard to Markdown format using Turndown (formerly to-markdown).

**🌐 Live Demo:** https://magwojtek.github.io/clipboard-to-markdown/

## Features

- 📋 Paste HTML directly from clipboard (Cmd+V / Ctrl+V)
- ✨ Convert HTML to clean Markdown
- ☑️ **Confluence support** - Converts Confluence checkboxes with proper indentation
- 📄 Copy Markdown result to clipboard
- 🎨 Modern, responsive UI
- ⚡ Fast local processing
- 🔒 All processing happens locally (no data sent to external servers)

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
# or for development with auto-restart:
npm run dev
```

2. Open your browser at `http://localhost:3000`

3. Use the application:
   - Press **Cmd+V** (Mac) or **Ctrl+V** (Windows/Linux) to paste content
   - The app automatically converts HTML to Markdown
   - Click "Copy" to copy the Markdown result to clipboard
   - Click "Clear & Paste Again" to convert more content

### Confluence Support

The converter has special support for Confluence content:
- ✅ **Code snippets** - Converts Confluence code blocks to Markdown fenced code blocks
  - Detects language from Confluence (JavaScript, Python, Java, etc.)
  - Preserves newlines
  - Strips line numbers automatically
  - **Known limitation:** Indentation may not be fully preserved (HTML parser collapses whitespace)
- ✅ **Task lists** - Converts checkboxes (`- [ ]` and `- [x]`)
- ✅ **Nested lists** - Preserves nested list indentation
- ✅ **Checked states** - Maintains checked/unchecked states
- ✅ Handles Confluence's custom HTML structure

#### Code Snippet Examples

When you copy code from Confluence, the converter automatically:
- Detects the programming language (if specified in Confluence)
- Creates proper fenced code blocks with language identifiers
- Preserves all formatting, indentation, and special characters
- Handles both block code and inline code snippets

Example conversion:
```
Confluence code block → ```javascript
                        const x = 1;
                        ```
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web server framework
- **Turndown** - HTML to Markdown converter (successor to to-markdown)

## Deployment

### GitHub Pages (Client-Side Version)

A client-side version is available in the `docs/` folder that runs entirely in the browser:

1. Push your code to GitHub
2. Go to your repository Settings → Pages
3. Under "Source", select "Deploy from a branch"
4. Select the `main` branch and `/docs` folder
5. Click Save
6. Your site will be available at `https://yourusername.github.io/clipboard-to-markdown/`

The client-side version uses Turndown loaded from CDN and performs all conversions in the browser.

### Local Server Version

For local development with the Node.js server:
- Run `npm start` or `npm run dev`
- Access at `http://localhost:3000`

## Notes

- The application uses Turndown instead of to-markdown, as the latter has been deprecated and replaced by Turndown
- Two versions available:
  - **Server version** (`public/` folder): Runs with Express server locally
  - **Client-side version** (`docs/` folder): Runs entirely in browser, deployable to GitHub Pages
- All conversion happens locally (no data sent to external servers)

## License

MIT
