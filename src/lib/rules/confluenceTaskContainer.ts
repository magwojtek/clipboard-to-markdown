import TurndownService from 'turndown';

function confluenceTaskContainer(turndownService: TurndownService): void {
    turndownService.addRule('confluenceTaskContainer', {
        filter: function (node: HTMLElement): boolean {
            return (
                node.nodeName === 'DIV' &&
                (node.getAttribute('data-task-local-id') !== null ||
                    node.getAttribute('role') === 'group')
            );
        },
        replacement: function (content: string): string {
            return content;
        },
    });
}

export { confluenceTaskContainer };
