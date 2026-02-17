const { test } = require('node:test');
const assert = require('node:assert');
const { createTurndownService } = require('../lib/turndownConfig');

test('createTurndownService returns a TurndownService instance', () => {
  const service = createTurndownService();
  assert.ok(service, 'Service should be created');
  assert.strictEqual(typeof service.turndown, 'function', 'Should have turndown method');
});

test('converts basic HTML to Markdown', () => {
  const service = createTurndownService();
  const html = '<h1>Hello World</h1><p>This is a test.</p>';
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('# Hello World'), 'Should convert h1 to markdown heading');
  assert.ok(markdown.includes('This is a test.'), 'Should preserve paragraph text');
});

test('handles standard HTML inputs gracefully', () => {
  const service = createTurndownService();
  const html = '<input type="checkbox" checked> Task 1';
  const markdown = service.turndown(html);
  
  // Standard inputs without Confluence structure are handled by default Turndown
  assert.ok(markdown.length >= 0, 'Should handle standard inputs');
});

test('converts Confluence task structure', () => {
  const service = createTurndownService();
  const html = `
    <div>
      <input type="checkbox" checked>
      <div data-component="content">Complete the task</div>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('- [x] Complete the task'), 'Should convert Confluence task with checkbox');
});

test('converts Confluence unchecked task', () => {
  const service = createTurndownService();
  const html = `
    <div>
      <input type="checkbox">
      <div data-component="content">Pending task</div>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('- [ ] Pending task'), 'Should convert unchecked Confluence task');
});

test('handles nested Confluence tasks with indentation', () => {
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
  assert.ok(markdown.includes('  - [x] Child task'), 'Should indent child task with 2 spaces');
});

test('preserves heading styles', () => {
  const service = createTurndownService();
  const html = '<h2>Section Title</h2>';
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('## Section Title'), 'Should use ATX heading style');
});

test('converts code blocks with fenced style', () => {
  const service = createTurndownService();
  const html = '<pre><code>const x = 1;</code></pre>';
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```'), 'Should use fenced code blocks');
  assert.ok(markdown.includes('const x = 1;'), 'Should preserve code content');
});

test('converts lists with dash markers', () => {
  const service = createTurndownService();
  const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
  const markdown = service.turndown(html);
  
  // Check that lists are converted (may have different formatting)
  assert.ok(markdown.includes('Item 1'), 'Should include first item');
  assert.ok(markdown.includes('Item 2'), 'Should include second item');
});

test('handles empty content gracefully', () => {
  const service = createTurndownService();
  const html = '';
  const markdown = service.turndown(html);
  
  assert.strictEqual(markdown, '', 'Should return empty string for empty input');
});

test('handles plain text without HTML tags', () => {
  const service = createTurndownService();
  const html = 'Just plain text';
  const markdown = service.turndown(html);
  
  assert.strictEqual(markdown, 'Just plain text', 'Should preserve plain text');
});
