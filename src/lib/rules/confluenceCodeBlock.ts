import TurndownService from 'turndown';

function confluenceCodeBlock(turndownService: TurndownService): void {
    turndownService.addRule('confluenceCodeBlock', {
        filter: function (node: HTMLElement): boolean {
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
                        (node.parentNode as HTMLElement).className?.includes('code')))
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
        replacement: function (content: string, node: HTMLElement): string {
            let language = '';
            let codeContent = '';

            // If this is a PRE inside a code-block, get language from parent
            if (node.nodeName === 'PRE' && node.parentNode) {
                const parent = node.parentNode as HTMLElement;
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
                    const innerHTML = (line as HTMLElement).innerHTML || '';

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

export { confluenceCodeBlock };
