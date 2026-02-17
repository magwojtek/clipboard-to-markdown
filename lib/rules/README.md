# Turndown Rules

This folder contains individual Turndown rules for converting Confluence HTML to Markdown.

## Structure

Each rule is in its own file for better organization and maintainability:

- **`confluenceCodeBlock.js`** - Converts Confluence code blocks to Markdown fenced code blocks
  - Handles DIV, PRE, and SPAN elements
  - Detects language from `data-code-lang` attribute (JavaScript, Python, Java, etc.)
  - Preserves newlines
  - Strips line numbers automatically
  - **Limitation:** Indentation may not be fully preserved (HTML parser collapses whitespace in inline elements)

- **`confluenceCodeSpan.js`** - Converts inline code spans to Markdown inline code
  - Handles SPAN and CODE elements with code-related classes
  - Preserves inline code formatting

- **`confluenceTaskWrapper.js`** - Converts Confluence task lists to Markdown checkboxes
  - Handles checked and unchecked states
  - Preserves nested list indentation

- **`confluenceTaskContainer.js`** - Handles Confluence task container elements
  - Manages task list grouping

- **`index.js`** - Exports all rules via `addConfluenceRules()` function

## Usage

### Node.js (Server)
```javascript
const { addConfluenceRules } = require('./rules');
const TurndownService = require('turndown');

const turndownService = new TurndownService();
addConfluenceRules(turndownService);
```

### Adding New Rules

1. Create a new file in this folder (e.g., `myNewRule.js`)
2. Export a function that takes `turndownService` as parameter
3. Add your rule using `turndownService.addRule()`
4. Import and call your rule in `index.js`

Example:
```javascript
// myNewRule.js
function myNewRule(turndownService) {
  turndownService.addRule('myNewRule', {
    filter: function (node) {
      // Your filter logic
    },
    replacement: function (content, node) {
      // Your replacement logic
    }
  });
}

module.exports = myNewRule;
```

Then in `index.js`:
```javascript
const myNewRule = require('./myNewRule');

function addConfluenceRules(turndownService) {
  // ... existing rules
  myNewRule(turndownService);
}
```

## Testing

All rules are tested in `/test/turndownConfig.test.js`. When adding new rules, add corresponding tests.
