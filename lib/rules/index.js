// Index file for all Confluence Turndown rules

const confluenceCodeBlock = require('./confluenceCodeBlock');
const confluenceCodeSpan = require('./confluenceCodeSpan');
const confluenceTaskWrapper = require('./confluenceTaskWrapper');
const confluenceTaskContainer = require('./confluenceTaskContainer');
const confluenceListItem = require('./confluenceListItem');

function addConfluenceRules(turndownService) {
  confluenceCodeBlock(turndownService);
  confluenceCodeSpan(turndownService);
  confluenceTaskWrapper(turndownService);
  confluenceTaskContainer(turndownService);
  confluenceListItem(turndownService);
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addConfluenceRules };
}
