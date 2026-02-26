// Browser-compatible Turndown rules bundle
// Auto-generated from lib/rules/ - DO NOT EDIT MANUALLY
// Run: yarn build:browser to regenerate

function confluenceCodeBlock(turndownService) {
    turndownService.addRule('confluenceCodeBlock', {
        filter: function (node) {
            if (node.nodeName !== 'DIV' && node.nodeName !== 'PRE' && node.nodeName !== 'SPAN')
                return false;

            const className = node.className || '';
            const dataLanguage = node.getAttribute('data-language');
            const dataCodeLang = node.getAttribute('data-code-lang');
            const dataCodeBlock = node.getAttribute('data-ds--code--code-block');

            // Check for SPAN with data-code-lang (modern Confluence)
            if (node.nodeName === 'SPAN' && (dataCodeLang || dataCodeBlock !== null)) {
                return true;
            }

            // Check for various Confluence code block patterns
            if (
                className.includes('code-block') ||
                className.includes('codeBlock') ||
                className.includes('ak-renderer-code-block') ||
                className.includes('codeContent') ||
                className.includes('syntaxhighlighter') ||
                dataLanguage ||
                dataCodeLang
            ) {
                return true;
            }

            // Check if it's a pre element with code-related attributes
            if (
                node.nodeName === 'PRE' &&
                (className.includes('code') ||
                    (node.parentNode &&
                        (node.parentNode ).className?.includes('code')))
            ) {
                return true;
            }

            // Check for div containing pre with code
            if (node.nodeName === 'DIV' && node.querySelector('pre')) {
                const parent = node;
                const hasCodeIndicator =
                    className.includes('code') ||
                    parent.querySelector('[class*="code"]') ||
                    parent.querySelector('[class*="syntaxhighlighter"]') ||
                    parent.querySelector('pre > code');

                if (hasCodeIndicator) {
                    return true;
                }
            }

            return false;
        },
        replacement: function (content, node) {
            let language = '';
            let codeContent = '';

            // If this is a PRE inside a code-block, get language from parent
            if (node.nodeName === 'PRE' && node.parentNode) {
                const parent = node.parentNode ;
                const parentDataLang = parent.getAttribute && parent.getAttribute('data-language');
                if (parentDataLang) {
                    language = parentDataLang;
                }
            }

            // Try to detect language from data-code-lang attribute
            // Check the node itself first, then child elements
            const dataCodeLang = node.getAttribute('data-code-lang');
            if (dataCodeLang) {
                language = dataCodeLang;
            } else {
                // Look for data-code-lang in child elements (modern Confluence)
                const spanWithLang = node.querySelector('[data-code-lang]');
                if (spanWithLang) {
                    language = spanWithLang.getAttribute('data-code-lang') || '';
                }
            }

            // Fallback: try other attributes if language not found
            if (!language) {
                const dataLanguage = node.getAttribute('data-language');
                const langClass = node.className.match(/language-(\w+)/);
                const brushClass = node.className.match(/brush:\s*(\w+)/);

                if (dataLanguage) {
                    language = dataLanguage;
                } else if (langClass && langClass[1]) {
                    language = langClass[1];
                } else if (brushClass && brushClass[1]) {
                    language = brushClass[1];
                }
            }

            // Extract code content
            const preElement = node.querySelector('pre');
            const codeElement = node.querySelector('code');

            // Check if code is structured with line elements (modern Confluence)
            const lineElements = node.querySelectorAll(
                '[data-testid^="renderer-code-block-line-"]'
            );

            if (lineElements && lineElements.length > 0) {
                // Extract text from each line element, preserving whitespace
                const lines = Array.from(lineElements).map((line) => {
                    // Get innerHTML and strip HTML tags to get raw text with whitespace
                    const innerHTML = (line ).innerHTML || '';

                    // Simple HTML tag removal that preserves text content including whitespace
                    let text = innerHTML
                        .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
                        .replace(/<[^>]+>/g, ''); // Remove all HTML tags

                    // Decode HTML entities
                    text = text
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'");

                    return text;
                });
                codeContent = lines.join('\n');
            } else if (codeElement) {
                codeContent = codeElement.textContent || '';
            } else if (preElement) {
                codeContent = preElement.textContent || '';
            } else if (node.nodeName === 'PRE') {
                codeContent = node.textContent || '';
            } else {
                codeContent = node.textContent || '';
            }

            const lines = codeContent.split('\n');
            const cleanedLines = lines.map((line) => {
                return line.replace(/^\d+\s{2,}/, '');
            });

            codeContent = cleanedLines.join('\n').replace(/\n+$/, '');

            return '\n```' + language + '\n' + codeContent + '\n```\n\n';
        },
    });
}

function confluenceCodeSpan(turndownService) {
    turndownService.addRule('confluenceCodeSpan', {
        filter: function (node) {
            if (node.nodeName !== 'SPAN' && node.nodeName !== 'CODE') return false;

            const className = node.className || '';
            return (
                className.includes('code') ||
                className.includes('monospace') ||
                node.getAttribute('data-inline-code') === 'true'
            );
        },
        replacement: function (content, node) {
            const text = node.textContent || '';
            return '`' + text + '`';
        },
    });
}

function confluenceListItem(turndownService) {
    turndownService.addRule('confluenceListItem', {
        filter: function (node) {
            return (
                node.nodeName === 'LI' &&
                node.querySelector('p[data-renderer-start-pos]') !== null &&
                !node.querySelector('input[type="checkbox"]')
            );
        },
        replacement: function (content, node, options: Options) {
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

function confluenceTaskContainer(turndownService) {
    turndownService.addRule('confluenceTaskContainer', {
        filter: function (node) {
            return (
                node.nodeName === 'DIV' &&
                (node.getAttribute('data-task-local-id') !== null ||
                    node.getAttribute('role') === 'group')
            );
        },
        replacement: function (content) {
            return content;
        },
    });
}

function confluenceTaskWrapper(turndownService) {
    turndownService.addRule('confluenceTaskWrapper', {
        filter: function (node) {
            return (
                node.nodeName === 'DIV' &&
                node.querySelector('input[type="checkbox"]') !== null &&
                node.querySelector('[data-component="content"]') !== null
            );
        },
        replacement: function (content, node) {
            const checkbox = node.querySelector(
                'input[type="checkbox"]'
            ) ;
            const contentDiv = node.querySelector('[data-component="content"]');

            if (!checkbox || !contentDiv) {
                return content;
            }

            let depth = 0;
            let parent = node.parentNode;
            while (parent) {
                if (
                    parent.nodeName === 'DIV' &&
                    (parent ).getAttribute('role') === 'group'
                ) {
                    const style = (parent ).getAttribute('style') || '';
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

function table(turndownService) {
    turndownService.addRule('table', {
        filter: 'table',
        replacement: function (content, node) {
            const rows = Array.from(node.querySelectorAll('tr'));
            if (rows.length === 0) return '';

            const tableData = [];
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

            const columnWidths = [];
            for (let i = 0; i < columnCount; i++) {
                let maxWidth = 3;
                normalizedData.forEach((row) => {
                    if (row[i]) {
                        maxWidth = Math.max(maxWidth, row[i].length);
                    }
                });
                columnWidths.push(maxWidth);
            }

            const formatRow = (rowData) => {
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

            const lines = [];

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
        replacement: function (content) {
            return content;
        },
    });
}

function getTurndownOptions() {
    return {
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        bulletListMarker: '-',
    };
}

// Main function to add all rules
function addConfluenceRules(turndownService) {
  confluenceCodeSpan(turndownService);
  confluenceListItem(turndownService);
  confluenceTaskContainer(turndownService);
  confluenceTaskWrapper(turndownService);
  table(turndownService);
  confluenceCodeBlock(turndownService);
}
