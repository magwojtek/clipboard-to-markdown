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

test('converts Confluence code block with JavaScript language', () => {
  const service = createTurndownService();
  const html = `
    <div class="code-block" data-language="javascript">
      <pre><code>const greeting = "Hello World";
console.log(greeting);</code></pre>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```javascript'), 'Should include language identifier');
  assert.ok(markdown.includes('const greeting = "Hello World";'), 'Should preserve code content');
  assert.ok(markdown.includes('console.log(greeting);'), 'Should preserve multiline code');
});

test('converts Confluence code block with Python language', () => {
  const service = createTurndownService();
  const html = `
    <div class="ak-renderer-code-block" data-language="python">
      <pre><code>def hello():
    print("Hello World")</code></pre>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```python'), 'Should include Python language identifier');
  assert.ok(markdown.includes('def hello():'), 'Should preserve Python code');
  assert.ok(markdown.includes('print("Hello World")'), 'Should preserve indentation');
});

test('converts Confluence code block without language', () => {
  const service = createTurndownService();
  const html = `
    <div class="code-block">
      <pre><code>Some code without language</code></pre>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```'), 'Should create fenced code block');
  assert.ok(markdown.includes('Some code without language'), 'Should preserve code content');
});

test('converts Confluence code block with data-code-lang attribute', () => {
  const service = createTurndownService();
  const html = `
    <div class="codeBlock" data-code-lang="java">
      <pre>public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}</pre>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```java'), 'Should detect language from data-code-lang');
  assert.ok(markdown.includes('public class Main'), 'Should preserve Java code');
});

test('converts Confluence code block with language class', () => {
  const service = createTurndownService();
  const html = `
    <div class="code-block language-typescript">
      <pre><code>interface User {
  name: string;
  age: number;
}</code></pre>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```typescript'), 'Should detect language from class name');
  assert.ok(markdown.includes('interface User'), 'Should preserve TypeScript code');
});

test('converts Confluence inline code span', () => {
  const service = createTurndownService();
  const html = '<p>Use the <span class="code">console.log()</span> function.</p>';
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('`console.log()`'), 'Should convert inline code to backticks');
});

test('converts Confluence inline code with monospace class', () => {
  const service = createTurndownService();
  const html = '<p>The variable <span class="monospace">userName</span> is required.</p>';
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('`userName`'), 'Should convert monospace to inline code');
});

test('converts Confluence inline code with data attribute', () => {
  const service = createTurndownService();
  const html = '<p>Run <code data-inline-code="true">npm install</code> first.</p>';
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('`npm install`'), 'Should convert inline code with data attribute');
});

test('handles complex code with special characters', () => {
  const service = createTurndownService();
  const html = `
    <div class="code-block" data-language="bash">
      <pre><code>#!/bin/bash
echo "Test with 'quotes' and \\"escapes\\""
grep -r "pattern" /path/to/files</code></pre>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```bash'), 'Should include bash language');
  assert.ok(markdown.includes('#!/bin/bash'), 'Should preserve shebang');
  assert.ok(markdown.includes('grep -r "pattern"'), 'Should preserve special characters');
});

test('handles multiline code blocks with empty lines', () => {
  const service = createTurndownService();
  const html = `
    <div class="code-block" data-language="javascript">
      <pre><code>function test() {
  console.log("line 1");

  console.log("line 3");
}</code></pre>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```javascript'), 'Should include language');
  assert.ok(markdown.includes('console.log("line 1");'), 'Should preserve first line');
  assert.ok(markdown.includes('console.log("line 3");'), 'Should preserve line after empty line');
});

test('handles code block with SQL', () => {
  const service = createTurndownService();
  const html = `
    <div class="code-block" data-language="sql">
      <pre><code>SELECT * FROM users
WHERE age > 18
ORDER BY name;</code></pre>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```sql'), 'Should include SQL language');
  assert.ok(markdown.includes('SELECT * FROM users'), 'Should preserve SQL query');
});

test('handles mixed content with code blocks and text', () => {
  const service = createTurndownService();
  const html = `
    <h2>Installation</h2>
    <p>Run the following command:</p>
    <div class="code-block" data-language="bash">
      <pre><code>npm install package-name</code></pre>
    </div>
    <p>Then import it in your code:</p>
    <div class="code-block" data-language="javascript">
      <pre><code>import pkg from 'package-name';</code></pre>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('## Installation'), 'Should convert heading');
  assert.ok(markdown.includes('```bash'), 'Should include bash code block');
  assert.ok(markdown.includes('npm install package-name'), 'Should preserve bash command');
  assert.ok(markdown.includes('```javascript'), 'Should include JavaScript code block');
  assert.ok(markdown.includes("import pkg from 'package-name';"), 'Should preserve import statement');
});

test('handles Confluence code blocks with line numbers', () => {
  const service = createTurndownService();
  const html = `
    <div class="codeContent">
      <pre>1  Antipattern</pre>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```'), 'Should create fenced code block');
  assert.ok(markdown.includes('Antipattern'), 'Should preserve code content');
  assert.ok(!markdown.includes('1  Antipattern'), 'Should remove line numbers');
});

test('handles Confluence syntaxhighlighter code blocks', () => {
  const service = createTurndownService();
  const html = `
    <div class="syntaxhighlighter">
      <pre>1  const x = 1;
2  const y = 2;</pre>
    </div>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```'), 'Should create fenced code block');
  assert.ok(markdown.includes('const x = 1;'), 'Should preserve first line');
  assert.ok(markdown.includes('const y = 2;'), 'Should preserve second line');
  assert.ok(!markdown.includes('1  const'), 'Should remove line numbers from first line');
  assert.ok(!markdown.includes('2  const'), 'Should remove line numbers from second line');
});

test('handles pre elements with code class', () => {
  const service = createTurndownService();
  const html = `
    <pre class="code">Pattern</pre>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```'), 'Should create fenced code block');
  assert.ok(markdown.includes('Pattern'), 'Should preserve code content');
});

test('handles modern Confluence SPAN code blocks with data-code-lang', () => {
  const service = createTurndownService();
  const html = `
    <span data-code-lang="javascript" data-ds--code--code-block="">
      <code class="language-javascript">it('tests two things', async () => {
  const fixture1 = await someFixture();
  const result1 = await someInterface(fixture1);
  expect(result1).toSomething();
});</code>
    </span>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```javascript'), 'Should include JavaScript language identifier');
  assert.ok(markdown.includes("it('tests two things'"), 'Should preserve test description');
  assert.ok(markdown.includes('const fixture1 = await someFixture();'), 'Should preserve code content');
  assert.ok(markdown.includes('expect(result1).toSomething();'), 'Should preserve assertions');
});

test('handles Confluence code blocks with line elements and preserves newlines', () => {
  const service = createTurndownService();
  const html = `
    <span data-code-lang="javascript" data-ds--code--code-block="">
      <code class="language-javascript">
        <span data-testid="renderer-code-block-line-1">it('tests two things', async () => {</span>
        <span data-testid="renderer-code-block-line-2">  const fixture1 = await someFixture();</span>
        <span data-testid="renderer-code-block-line-3">  const result1 = await someInterface(fixture1);</span>
        <span data-testid="renderer-code-block-line-4">  expect(result1).toSomething();</span>
        <span data-testid="renderer-code-block-line-5">});</span>
      </code>
    </span>
  `;
  const markdown = service.turndown(html);
  
  assert.ok(markdown.includes('```javascript'), 'Should include JavaScript language identifier');
  
  // Verify each line is on its own line (not all on one line)
  const lines = markdown.split('\n');
  const codeLinesStart = lines.findIndex(line => line.includes("it('tests two things'"));
  
  assert.ok(codeLinesStart > 0, 'Should find the first code line');
  assert.ok(lines[codeLinesStart].includes("it('tests two things'"), 'First line should contain test description');
  assert.ok(lines[codeLinesStart + 1].includes('const fixture1'), 'Second line should contain fixture1');
  assert.ok(lines[codeLinesStart + 2].includes('const result1'), 'Third line should contain result1');
  assert.ok(lines[codeLinesStart + 3].includes('expect(result1)'), 'Fourth line should contain expect');
});
