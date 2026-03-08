import TurndownService from 'turndown';
import { confluenceCodeBlock } from './confluenceCodeBlock';
import { confluenceCodeSpan } from './confluenceCodeSpan';
import { confluenceTaskWrapper } from './confluenceTaskWrapper';
import { confluenceTaskContainer } from './confluenceTaskContainer';
import { confluenceListItem } from './confluenceListItem';
import { table } from './table';

export function addConfluenceRules(turndownService: TurndownService): void {
    confluenceCodeSpan(turndownService);
    confluenceTaskWrapper(turndownService);
    confluenceTaskContainer(turndownService);
    confluenceListItem(turndownService);
    table(turndownService);
    confluenceCodeBlock(turndownService);
}
