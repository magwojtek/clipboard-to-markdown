# Shared Library

This folder contains shared code used by both the backend server and frontend static application.

## Files

### `turndownRules.ts` 
**Main entry point** - Re-exports rules from the `rules/` folder for backward compatibility.

Contains:
- `addConfluenceRules(turndownService: TurndownService): void` - Adds all Confluence rules (imported from `rules/index.ts`)
- `getTurndownOptions(): Options` - Returns standard Turndown configuration options
  - ATX heading style
  - Fenced code blocks
  - Dash list markers

### `rules/` folder
**Individual Turndown rules** - Each rule in its own file for better organization.

Files:
- **`confluenceCodeBlock.ts`** - Converts code blocks with language detection and newline preservation
- **`confluenceCodeSpan.ts`** - Converts inline code spans to backticks
- **`confluenceTaskWrapper.ts`** - Converts task lists with checkboxes and nested indentation
- **`confluenceTaskContainer.ts`** - Handles task container elements
- **`confluenceListItem.ts`** - Converts list items with proper indentation
- **`table.ts`** - Converts HTML tables to Markdown format
- **`index.ts`** - Exports all rules via `addConfluenceRules()` function
- **`README.md`** - Documentation for the rules folder

See `rules/README.md` for detailed information about each rule and how to add new ones.

### `turndownConfig.ts` 
**Node.js-specific wrapper** - Used by the backend server.

Imports `turndownRules.ts` and creates a TurndownService instance with the shared rules applied.

## Usage

### Backend (Node.js)
```typescript
import { createTurndownService } from './lib/turndownConfig';
const service = createTurndownService();
const markdown = service.turndown(html);
```

### Frontend (Browser)
The browser build is compiled from TypeScript and uses the same shared library:

```typescript
import { createTurndownService } from '../src/lib/turndownConfig';
const turndownService = createTurndownService();
const markdown = turndownService.turndown(html);
```

The compiled JavaScript is bundled and served as `public/app.js`.

## Benefits

- **Single source of truth** - Conversion rules defined once in TypeScript
- **Type safety** - TypeScript provides compile-time type checking
- **Consistency** - Both frontend and backend use identical logic
- **Maintainability** - Update rules in one place
- **Testability** - Shared rules can be tested once with full type coverage
