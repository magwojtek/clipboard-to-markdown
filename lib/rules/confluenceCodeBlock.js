// Rule for converting Confluence code blocks to Markdown fenced code blocks
// Handles various Confluence HTML structures including modern SPAN-based blocks

function confluenceCodeBlock(turndownService) {
  turndownService.addRule('confluenceCodeBlock', {
    filter: function (node) {
      if (node.nodeName !== 'DIV' && node.nodeName !== 'PRE' && node.nodeName !== 'SPAN') return false;
      
      const className = node.className || '';
      const dataLanguage = node.getAttribute('data-language');
      const dataCodeLang = node.getAttribute('data-code-lang');
      const dataCodeBlock = node.getAttribute('data-ds--code--code-block');
      
      // Check for SPAN with data-code-lang (modern Confluence)
      if (node.nodeName === 'SPAN' && (dataCodeLang || dataCodeBlock !== null)) {
        return true;
      }
      
      // Check for various Confluence code block patterns
      if (
        className.includes('code-block') ||
        className.includes('codeBlock') ||
        className.includes('ak-renderer-code-block') ||
        className.includes('codeContent') ||
        className.includes('syntaxhighlighter') ||
        dataLanguage ||
        dataCodeLang
      ) {
        return true;
      }
      
      // Check if it's a pre element with code-related attributes
      if (node.nodeName === 'PRE' && (
        className.includes('code') ||
        node.parentNode.className.includes('code')
      )) {
        return true;
      }
      
      // Check for div containing pre with code
      if (node.nodeName === 'DIV' && node.querySelector('pre')) {
        const parent = node;
        const hasCodeIndicator = 
          className.includes('code') ||
          parent.querySelector('[class*="code"]') ||
          parent.querySelector('[class*="syntaxhighlighter"]') ||
          parent.querySelector('pre > code');
        
        if (hasCodeIndicator) {
          return true;
        }
      }
      
      return false;
    },
    replacement: function (content, node) {
      let language = '';
      let codeContent = '';
      
      // Try to detect language from data-code-lang attribute
      // Check the node itself first, then child elements
      const dataCodeLang = node.getAttribute('data-code-lang');
      if (dataCodeLang) {
        language = dataCodeLang;
      } else {
        // Look for data-code-lang in child elements (modern Confluence)
        const spanWithLang = node.querySelector('[data-code-lang]');
        if (spanWithLang) {
          language = spanWithLang.getAttribute('data-code-lang') || '';
        }
      }
      
      // Fallback: try other attributes if language not found
      if (!language) {
        const dataLanguage = node.getAttribute('data-language');
        const langClass = node.className.match(/language-(\w+)/);
        const brushClass = node.className.match(/brush:\s*(\w+)/);
        
        if (dataLanguage) {
          language = dataLanguage;
        } else if (langClass && langClass[1]) {
          language = langClass[1];
        } else if (brushClass && brushClass[1]) {
          language = brushClass[1];
        }
      }
      
      // Extract code content
      const preElement = node.querySelector('pre');
      const codeElement = node.querySelector('code');
      
      // Check if code is structured with line elements (modern Confluence)
      const lineElements = node.querySelectorAll('[data-testid^="renderer-code-block-line-"]');
      
      if (lineElements && lineElements.length > 0) {
        // Extract text from each line element, preserving whitespace
        const lines = Array.from(lineElements).map(line => {
          // Confluence stores code with proper whitespace in nested span elements
          // The HTML parser collapses whitespace-only text nodes, so we need to
          // extract from innerHTML and strip HTML tags while preserving spaces
          
          // Get innerHTML and strip HTML tags to get raw text with whitespace
          const innerHTML = line.innerHTML || '';
          
          // Simple HTML tag removal that preserves text content including whitespace
          // This is more reliable than textContent which collapses whitespace
          let text = innerHTML
            .replace(/<br\s*\/?>/gi, '\n')  // Convert <br> to newlines
            .replace(/<[^>]+>/g, '');        // Remove all HTML tags
          
          // Decode HTML entities
          text = text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
          
          return text;
        });
        codeContent = lines.join('\n');
      } else if (codeElement) {
        codeContent = codeElement.textContent || '';
      } else if (preElement) {
        codeContent = preElement.textContent || '';
      } else if (node.nodeName === 'PRE') {
        codeContent = node.textContent || '';
      } else {
        codeContent = node.textContent || '';
      }
      
      // Clean up line numbers if present (common in Confluence)
      // Line numbers are typically at the start of each line followed by whitespace
      // But we need to preserve the actual code indentation
      const lines = codeContent.split('\n');
      const cleanedLines = lines.map(line => {
        // Remove line numbers at the start (e.g., "1  " or "12  ")
        // but preserve any indentation that comes after the line number
        // Pattern: optional whitespace, digits, two or more spaces
        // We only remove if there are 2+ spaces after the number (line number separator)
        return line.replace(/^\d+\s{2,}/, '');
      });
      
      // Join lines but DON'T trim - that would remove indentation!
      // Only remove trailing newlines at the very end
      codeContent = cleanedLines.join('\n').replace(/\n+$/, '');
      
      return '\n```' + language + '\n' + codeContent + '\n```\n\n';
    }
  });
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = confluenceCodeBlock;
}
