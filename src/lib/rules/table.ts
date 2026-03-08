import TurndownService from 'turndown';

function table(turndownService: TurndownService): void {
    turndownService.addRule('table', {
        filter: 'table',
        replacement: function (content: string, node: HTMLElement): string {
            const rows = Array.from(node.querySelectorAll('tr'));
            if (rows.length === 0) return '';

            const tableData: string[][] = [];
            let hasHeader = false;
            let columnCount = 0;

            rows.forEach((row, rowIndex) => {
                const cells = Array.from(row.querySelectorAll('th, td'));
                const rowData = cells.map((cell) => {
                    const cellContent = cell.textContent || '';
                    return cellContent.trim().replace(/\n/g, ' ').replace(/\|/g, '\\|');
                });

                if (rowIndex === 0 && row.querySelector('th')) {
                    hasHeader = true;
                }

                tableData.push(rowData);
                columnCount = Math.max(columnCount, rowData.length);
            });

            if (tableData.length === 0) return '';

            const normalizedData = tableData.map((row) => {
                while (row.length < columnCount) {
                    row.push('');
                }
                return row;
            });

            const columnWidths: number[] = [];
            for (let i = 0; i < columnCount; i++) {
                let maxWidth = 3;
                normalizedData.forEach((row) => {
                    if (row[i]) {
                        maxWidth = Math.max(maxWidth, row[i].length);
                    }
                });
                columnWidths.push(maxWidth);
            }

            const formatRow = (rowData: string[]): string => {
                return (
                    '| ' +
                    rowData
                        .map((cell, i) => {
                            return cell.padEnd(columnWidths[i], ' ');
                        })
                        .join(' | ') +
                    ' |'
                );
            };

            const lines: string[] = [];

            if (hasHeader && normalizedData.length > 0) {
                lines.push(formatRow(normalizedData[0]));

                const separatorRow = columnWidths.map((width) => '-'.repeat(width));
                lines.push('| ' + separatorRow.join(' | ') + ' |');

                for (let i = 1; i < normalizedData.length; i++) {
                    lines.push(formatRow(normalizedData[i]));
                }
            } else {
                normalizedData.forEach((row) => {
                    lines.push(formatRow(row));
                });
            }

            return '\n' + lines.join('\n') + '\n\n';
        },
    });

    turndownService.addRule('tableCell', {
        filter: ['th', 'td'],
        replacement: function (content: string): string {
            return content;
        },
    });
}

export { table };
