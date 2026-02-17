const TurndownService = require('turndown');
const { addConfluenceRules, getTurndownOptions } = require('./turndownRules');

function createTurndownService() {
  const turndownService = new TurndownService(getTurndownOptions());
  addConfluenceRules(turndownService);
  return turndownService;
}

module.exports = { createTurndownService };
