// Rule for converting Confluence inline code spans to Markdown inline code

function confluenceCodeSpan(turndownService) {
  turndownService.addRule('confluenceCodeSpan', {
    filter: function (node) {
      if (node.nodeName !== 'SPAN' && node.nodeName !== 'CODE') return false;
      
      const className = node.className || '';
      return (
        className.includes('code') ||
        className.includes('monospace') ||
        node.getAttribute('data-inline-code') === 'true'
      );
    },
    replacement: function (content, node) {
      const text = node.textContent || '';
      return '`' + text + '`';
    }
  });
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = confluenceCodeSpan;
}
