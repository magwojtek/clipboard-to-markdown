function confluenceListItem(turndownService) {
  turndownService.addRule('confluenceListItem', {
    filter: function (node) {
      return (
        node.nodeName === 'LI' &&
        node.querySelector('p[data-renderer-start-pos]') &&
        !node.querySelector('input[type="checkbox"]')
      );
    },
    replacement: function (content, node, options) {
      content = content.replace(/^\n+|\n+$/g, '').trim();
      
      const prefix = options.bulletListMarker || '-';
      let indent = '';
      
      let parent = node.parentNode;
      let depth = 0;
      while (parent) {
        if (parent.nodeName === 'UL' || parent.nodeName === 'OL') {
          depth++;
        }
        parent = parent.parentNode;
      }
      
      if (depth > 1) {
        indent = '    '.repeat(depth - 1);
      }
      
      return indent + prefix + '   ' + content + '\n';
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = confluenceListItem;
}
