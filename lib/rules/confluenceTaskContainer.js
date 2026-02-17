// Rule for handling Confluence task container elements

function confluenceTaskContainer(turndownService) {
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

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = confluenceTaskContainer;
}
