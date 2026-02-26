import { addConfluenceRules } from './rules';
import { Options } from 'turndown';

export function getTurndownOptions(): Options {
    return {
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        bulletListMarker: '-',
    };
}

export { addConfluenceRules };
