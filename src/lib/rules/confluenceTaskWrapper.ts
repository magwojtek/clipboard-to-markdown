import TurndownService from 'turndown';

function confluenceTaskWrapper(turndownService: TurndownService): void {
    turndownService.addRule('confluenceTaskWrapper', {
        filter: function (node: HTMLElement): boolean {
            return (
                node.nodeName === 'DIV' &&
                node.querySelector('input[type="checkbox"]') !== null &&
                node.querySelector('[data-component="content"]') !== null
            );
        },
        replacement: function (content: string, node: HTMLElement): string {
            const checkbox = node.querySelector(
                'input[type="checkbox"]'
            ) as HTMLInputElement | null;
            const contentDiv = node.querySelector('[data-component="content"]');

            if (!checkbox || !contentDiv) {
                return content;
            }

            let depth = 0;
            let parent = node.parentNode;
            while (parent) {
                if (
                    parent.nodeName === 'DIV' &&
                    (parent as HTMLElement).getAttribute('role') === 'group'
                ) {
                    const style = (parent as HTMLElement).getAttribute('style') || '';
                    if (style.includes('margin') && style.includes('24px')) {
                        depth++;
                    }
                }
                parent = parent.parentNode;
            }

            const indent = '  '.repeat(depth);
            const checked = checkbox.checked || checkbox.hasAttribute('checked');
            const prefix = checked ? '- [x] ' : '- [ ] ';
            const text = contentDiv.textContent?.trim() || '';

            return indent + prefix + text + '\n';
        },
    });
}

export { confluenceTaskWrapper };
