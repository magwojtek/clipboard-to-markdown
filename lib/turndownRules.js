// Shared Turndown configuration rules for both Node.js and browser environments
// This file contains the pure rule definitions that can be applied to any TurndownService instance

function addConfluenceRules(turndownService) {
  turndownService.addRule('confluenceTaskWrapper', {
    filter: function (node) {
      return (
        node.nodeName === 'DIV' &&
        node.querySelector('input[type="checkbox"]') &&
        node.querySelector('[data-component="content"]')
      );
    },
    replacement: function (content, node) {
      const checkbox = node.querySelector('input[type="checkbox"]');
      const contentDiv = node.querySelector('[data-component="content"]');
      
      if (!checkbox || !contentDiv) {
        return content;
      }
      
      let depth = 0;
      let parent = node.parentNode;
      while (parent) {
        if (parent.nodeName === 'DIV' && parent.getAttribute('role') === 'group') {
          const style = parent.getAttribute('style') || '';
          if (style.includes('margin') && style.includes('24px')) {
            depth++;
          }
        }
        parent = parent.parentNode;
      }
      
      const indent = '  '.repeat(depth);
      const checked = checkbox.checked || checkbox.hasAttribute('checked');
      const prefix = checked ? '- [x] ' : '- [ ] ';
      const text = contentDiv.textContent.trim();
      
      return indent + prefix + text + '\n';
    }
  });

  turndownService.addRule('confluenceTaskContainer', {
    filter: function (node) {
      return (
        node.nodeName === 'DIV' &&
        (node.getAttribute('data-task-local-id') || 
         node.getAttribute('role') === 'group')
      );
    },
    replacement: function (content) {
      return content;
    }
  });
}

function getTurndownOptions() {
  return {
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-'
  };
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addConfluenceRules, getTurndownOptions };
}
