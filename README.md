# Clipboard to Markdown Converter

A simple local web application that converts HTML from your clipboard to Markdown format using Turndown (formerly to-markdown).

## Features

- 📋 Paste HTML directly from clipboard
- ✨ Convert HTML to clean Markdown
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
```

2. Open your browser at `http://localhost:3000`

3. Use the application:
   - Click "Paste from Clipboard" to paste HTML content
   - Or manually paste HTML into the left textarea
   - Click "Convert to Markdown" to convert
   - Click "Copy Markdown" to copy the result to clipboard
   - Use Ctrl+Enter (Cmd+Enter on Mac) in the HTML input to quickly convert

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
