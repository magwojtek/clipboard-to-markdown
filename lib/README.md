# Shared Library

This folder contains shared code used by both the backend server and frontend static application.

## Files

### `turndownRules.js`
**Main entry point** - Re-exports rules from the `rules/` folder for backward compatibility.

Contains:
- `addConfluenceRules(turndownService)` - Adds all Confluence rules (imported from `rules/index.js`)
- `getTurndownOptions()` - Returns standard Turndown configuration options
  - ATX heading style
  - Fenced code blocks
  - Dash list markers

### `rules/` folder
**Individual Turndown rules** - Each rule in its own file for better organization.

Files:
- **`confluenceCodeBlock.js`** - Converts code blocks with language detection and newline preservation
- **`confluenceCodeSpan.js`** - Converts inline code spans to backticks
- **`confluenceTaskWrapper.js`** - Converts task lists with checkboxes and nested indentation
- **`confluenceTaskContainer.js`** - Handles task container elements
- **`index.js`** - Exports all rules via `addConfluenceRules()` function
- **`README.md`** - Documentation for the rules folder

See `rules/README.md` for detailed information about each rule and how to add new ones.

### `turndownConfig.js`
**Node.js-specific wrapper** - Used by the backend server.

Imports `turndownRules.js` and creates a TurndownService instance with the shared rules applied.

## Usage

### Backend (Node.js)
```javascript
const { createTurndownService } = require('./lib/turndownConfig');
const service = createTurndownService();
const markdown = service.turndown(html);
```

### Frontend (Browser)
```html
<script src="https://unpkg.com/turndown@7.1.2/dist/turndown.js"></script>
<script src="../lib/turndownRules.js"></script>
<script>
  const service = new TurndownService(getTurndownOptions());
  addConfluenceRules(service);
  const markdown = service.turndown(html);
</script>
```

## Benefits

- **Single source of truth** - Conversion rules defined once
- **Consistency** - Both frontend and backend use identical logic
- **Maintainability** - Update rules in one place
- **Testability** - Shared rules can be tested once
