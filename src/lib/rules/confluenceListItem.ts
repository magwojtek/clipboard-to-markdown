import TurndownService, { Options } from 'turndown';

function confluenceListItem(turndownService: TurndownService): void {
    turndownService.addRule('confluenceListItem', {
        filter: function (node: HTMLElement): boolean {
            return (
                node.nodeName === 'LI' &&
                node.querySelector('p[data-renderer-start-pos]') !== null &&
                !node.querySelector('input[type="checkbox"]')
            );
        },
        replacement: function (content: string, node: HTMLElement, options: Options): string {
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
        },
    });
}

export { confluenceListItem };
