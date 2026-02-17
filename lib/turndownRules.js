// Shared Turndown configuration rules for both Node.js and browser environments
// This file re-exports rules from the rules folder for backward compatibility

const { addConfluenceRules } = require('./rules');

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
