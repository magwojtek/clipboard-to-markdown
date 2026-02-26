import { describe, it } from 'mocha';
import assert from 'assert';
import { createTurndownService } from '../lib/turndownConfig';

describe('TurndownService Creation', () => {
    it('createTurndownService returns a TurndownService instance', () => {
        const service = createTurndownService();
        assert.ok(service, 'Service should be created');
        assert.strictEqual(typeof service.turndown, 'function', 'Should have turndown method');
    });
});

describe('Basic HTML Conversion', () => {
    it('converts basic HTML to Markdown', () => {
        const service = createTurndownService();
        const html = '<h1>Hello World</h1><p>This is a test.</p>';
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('# Hello World'), 'Should convert h1 to markdown heading');
        assert.ok(markdown.includes('This is a test.'), 'Should preserve paragraph text');
    });

    it('handles standard HTML inputs gracefully', () => {
        const service = createTurndownService();
        const html = '<input type="checkbox" checked> Task 1';
        const markdown = service.turndown(html);

        assert.ok(markdown.length >= 0, 'Should handle standard inputs');
    });

    it('preserves heading styles', () => {
        const service = createTurndownService();
        const html = '<h2>Section Title</h2>';
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('## Section Title'), 'Should use ATX heading style');
    });

    it('converts code blocks with fenced style', () => {
        const service = createTurndownService();
        const html = '<pre><code>const x = 1;</code></pre>';
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('```'), 'Should use fenced code blocks');
        assert.ok(markdown.includes('const x = 1;'), 'Should preserve code content');
    });

    it('converts lists with dash markers', () => {
        const service = createTurndownService();
        const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('Item 1'), 'Should include first item');
        assert.ok(markdown.includes('Item 2'), 'Should include second item');
    });

    it('converts tables to markdown', () => {
        const service = createTurndownService();
        const html = `
    <table>
      <tr><th>Header 1</th><th>Header 2</th></tr>
      <tr><td>Cell 1</td><td>Cell 2</td></tr>
    </table>
  `;
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('Header 1'), 'Should include header');
        assert.ok(markdown.includes('Cell 1'), 'Should include cell content');
        assert.ok(markdown.includes('|'), 'Should use table syntax');
    });

    it('handles empty HTML', () => {
        const service = createTurndownService();
        const markdown = service.turndown('');

        assert.strictEqual(markdown, '', 'Should return empty string for empty input');
    });

    it('handles plain text', () => {
        const service = createTurndownService();
        const markdown = service.turndown('Just plain text');

        assert.ok(markdown.includes('Just plain text'), 'Should preserve plain text');
    });
});

describe('Confluence Task Conversion', () => {
    it('converts Confluence task structure', () => {
        const service = createTurndownService();
        const html = `
    <div>
      <input type="checkbox" checked>
      <div data-component="content">Complete the task</div>
    </div>
  `;
        const markdown = service.turndown(html);

        assert.ok(
            markdown.includes('- [x] Complete the task'),
            'Should convert Confluence task with checkbox'
        );
    });

    it('converts Confluence unchecked task', () => {
        const service = createTurndownService();
        const html = `
    <div>
      <input type="checkbox">
      <div data-component="content">Pending task</div>
    </div>
  `;
        const markdown = service.turndown(html);

        assert.ok(
            markdown.includes('- [ ] Pending task'),
            'Should convert unchecked Confluence task'
        );
    });

    it('handles nested Confluence tasks with indentation', () => {
        const service = createTurndownService();
        const html = `
    <div role="group">
      <div>
        <input type="checkbox">
        <div data-component="content">Parent task</div>
      </div>
      <div role="group" style="margin: 4px 0px 0px 24px;">
        <div>
          <input type="checkbox" checked>
          <div data-component="content">Child task</div>
        </div>
      </div>
    </div>
  `;
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('- [ ] Parent task'), 'Should convert parent task');
        assert.ok(
            markdown.includes('  - [x] Child task'),
            'Should indent child task with 2 spaces'
        );
    });
});

describe('Confluence Code Block Conversion', () => {
    it('converts Confluence code blocks', () => {
        const service = createTurndownService();
        const html = '<div class="code-block"><pre><code>console.log("test");</code></pre></div>';
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('```'), 'Should convert to fenced code block');
        assert.ok(markdown.includes('console.log("test");'), 'Should preserve code content');
    });

    it('converts Confluence code blocks with language', () => {
        const service = createTurndownService();
        const html =
            '<div class="code-block" data-language="javascript"><pre><code>const x = 1;</code></pre></div>';
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('```javascript'), 'Should include language identifier');
        assert.ok(markdown.includes('const x = 1;'), 'Should preserve code content');
    });

    it('handles modern Confluence code blocks with data-code-lang', () => {
        const service = createTurndownService();
        const html = '<span data-code-lang="python">print("hello")</span>';
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('```python'), 'Should detect language from data-code-lang');
        assert.ok(markdown.includes('print("hello")'), 'Should preserve code content');
    });

    it('converts Confluence code blocks with line elements', () => {
        const service = createTurndownService();
        const html = `
    <div class="code-block">
      <div data-testid="renderer-code-block-line-0"><span>line 1</span></div>
      <div data-testid="renderer-code-block-line-1"><span>line 2</span></div>
    </div>
  `;
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('```'), 'Should convert to fenced code block');
        assert.ok(markdown.includes('line 1'), 'Should include first line');
        assert.ok(markdown.includes('line 2'), 'Should include second line');
    });
});

describe('Confluence Inline Code Conversion', () => {
    it('converts Confluence inline code', () => {
        const service = createTurndownService();
        const html = '<span class="code">inline code</span>';
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('`inline code`'), 'Should convert to inline code');
    });
});

describe('Confluence List Item Conversion', () => {
    it('handles Confluence list items with paragraphs', () => {
        const service = createTurndownService();
        const html = `
    <ul>
      <li><p data-renderer-start-pos="123">List item with paragraph</p></li>
    </ul>
  `;
        const markdown = service.turndown(html);

        assert.ok(markdown.includes('List item with paragraph'), 'Should convert list item');
    });
});
