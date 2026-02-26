# Turndown Rules

This folder contains individual Turndown rules for converting HTML to Markdown. Each rule is in its own TypeScript file for better organization and maintainability.

## Rule Files

### `confluenceCodeBlock.ts`
Converts Confluence code blocks to fenced Markdown code blocks.

**Features:**
- Detects programming language from class names
- Preserves newlines and formatting
- Handles both `<pre>` and `<div class="code">` elements

**Example:**
```html
<div class="code panel"><pre class="language-javascript">const x = 1;</pre></div>
```
→
````markdown
```javascript
const x = 1;
```
````

### `confluenceCodeSpan.ts`
Converts inline code spans to backtick-wrapped Markdown.

**Features:**
- Handles `<code>` elements
- Preserves inline code formatting

**Example:**
```html
Use the <code>console.log()</code> function
```
→
```markdown
Use the `console.log()` function
```

### `confluenceTaskWrapper.ts`
Converts Confluence task lists to Markdown checkboxes.

**Features:**
- Converts checked/unchecked tasks
- Handles nested task indentation
- Preserves task hierarchy

**Example:**
```html
<div class="task-list">
  <div class="task-item checked">Complete task</div>
  <div class="task-item">Pending task</div>
</div>
```
→
```markdown
- [x] Complete task
- [ ] Pending task
```

### `confluenceTaskContainer.ts`
Handles Confluence task container elements.

**Features:**
- Wraps task lists properly
- Maintains structure for nested tasks

### `confluenceListItem.ts`
Converts list items with proper indentation and formatting.

**Features:**
- Handles nested lists
- Preserves list hierarchy
- Supports both ordered and unordered lists

### `table.ts`
Converts HTML tables to Markdown table format.

**Features:**
- Creates proper Markdown table syntax
- Handles headers and data rows
- Aligns columns appropriately

**Example:**
```html
<table>
  <tr><th>Name</th><th>Age</th></tr>
  <tr><td>Alice</td><td>30</td></tr>
</table>
```
→
```markdown
| Name  | Age |
|-------|-----|
| Alice | 30  |
```

## Adding New Rules

To add a new rule:

1. **Create a new file** in this folder (e.g., `myNewRule.ts`)

2. **Define your rule function**:
```typescript
import TurndownService from 'turndown';

export function myNewRule(turndownService: TurndownService): void {
    turndownService.addRule('myRuleName', {
        filter: 'div', // or function for complex filtering
        replacement: (content, node, options) => {
            // Your conversion logic here
            return convertedMarkdown;
        }
    });
}
```

3. **Export it in `index.ts`**:
```typescript
import { myNewRule } from './myNewRule';

export function addConfluenceRules(turndownService: TurndownService): void {
    // ... existing rules
    myNewRule(turndownService);
}
```

4. **Add tests** in `src/test/turndownConfig.test.ts`

## Rule Execution Order

Rules are applied in the order they're added in `index.ts`:
1. `confluenceCodeSpan`
2. `confluenceTaskWrapper`
3. `confluenceTaskContainer`
4. `confluenceListItem`
5. `table`
6. `confluenceCodeBlock` (last to avoid conflicts)

Order matters when rules might conflict or depend on each other.

## Testing

All rules are tested in `/src/test/turndownConfig.test.ts`. Each rule should have:
- Basic functionality tests
- Edge case tests
- Integration tests with other rules

Run tests with:
```bash
yarn test
```
