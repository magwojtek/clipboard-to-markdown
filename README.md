# Clipboard to Markdown Converter

A simple local web application that converts HTML from your clipboard to Markdown format using Turndown (formerly to-markdown).

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
- ✅ Converts task lists with checkboxes (`- [ ]` and `- [x]`)
- ✅ Preserves nested list indentation
- ✅ Maintains checked/unchecked states
- ✅ Handles Confluence's custom HTML structure

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web server framework
- **Turndown** - HTML to Markdown converter (successor to to-markdown)

## Notes

- The application uses Turndown instead of to-markdown, as the latter has been deprecated and replaced by Turndown
- All conversion happens on the server side for consistency
- The app runs entirely locally on your machine

## License

MIT
