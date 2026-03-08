import TurndownService from 'turndown';
import { addConfluenceRules, getTurndownOptions } from './turndownRules';

export function createTurndownService(): TurndownService {
    const turndownService = new TurndownService(getTurndownOptions());
    addConfluenceRules(turndownService);
    return turndownService;
}
