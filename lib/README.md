# Shared Library

This folder contains shared code used by both the backend server and frontend static application.

## Files

### `turndownRules.js`
**Shared Turndown configuration rules** - Works in both Node.js and browser environments.

Contains:
- `addConfluenceRules(turndownService)` - Adds custom rules for Confluence HTML structure
  - Handles Confluence task lists with checkboxes
  - Preserves nested list indentation (2 spaces per level)
  - Detects nesting via `role="group"` divs with `margin-left: 24px`
- `getTurndownOptions()` - Returns standard Turndown configuration options
  - ATX heading style
  - Fenced code blocks
  - Dash list markers

This file uses universal module pattern to work in both environments:
- Node.js: Uses `module.exports`
- Browser: Functions are available globally

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
