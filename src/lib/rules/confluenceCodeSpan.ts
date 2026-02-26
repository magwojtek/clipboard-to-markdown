import TurndownService from 'turndown';

function confluenceCodeSpan(turndownService: TurndownService): void {
    turndownService.addRule('confluenceCodeSpan', {
        filter: function (node: HTMLElement): boolean {
            if (node.nodeName !== 'SPAN' && node.nodeName !== 'CODE') return false;

            const className = node.className || '';
            return (
                className.includes('code') ||
                className.includes('monospace') ||
                node.getAttribute('data-inline-code') === 'true'
            );
        },
        replacement: function (content: string, node: HTMLElement): string {
            const text = node.textContent || '';
            return '`' + text + '`';
        },
    });
}

export { confluenceCodeSpan };
