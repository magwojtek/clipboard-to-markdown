import { createTurndownService } from '../src/lib/turndownConfig';
import './styles.css';

const pasteArea = document.getElementById('pasteArea') as HTMLElement;
const outputSection = document.getElementById('outputSection') as HTMLElement;
const markdownOutput = document.getElementById('markdownOutput') as HTMLElement;
const copyBtn = document.getElementById('copyBtn') as HTMLButtonElement;
const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
const statusElement = document.getElementById('status') as HTMLElement;

pasteArea.focus();

function showStatus(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
    statusElement.style.display = 'block';

    setTimeout(() => {
        statusElement.style.display = 'none';
    }, 3000);
}

function convertToMarkdown(html: string): string {
    const turndownService = createTurndownService();
    return turndownService.turndown(html);
}

async function handlePaste(event: ClipboardEvent): Promise<void> {
    event.preventDefault();

    const clipboardData =
        event.clipboardData ||
        ('clipboardData' in window
            ? (window as Window & { clipboardData: DataTransfer }).clipboardData
            : null);

    if (!clipboardData) {
        showStatus('Clipboard access not available', 'error');
        return;
    }

    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');

    if (!htmlData && !textData) {
        showStatus('No content found in clipboard', 'error');
        return;
    }

    const contentToConvert = htmlData || textData;

    showStatus('Converting...', 'info');

    try {
        const markdown = convertToMarkdown(contentToConvert);

        markdownOutput.textContent = markdown;
        outputSection.style.display = 'block';
        pasteArea.style.display = 'none';

        showStatus('✓ Converted successfully!', 'success');
    } catch (error) {
        console.error('Conversion error:', error);
        showStatus('✗ Conversion failed. Please try again.', 'error');
    }
}

pasteArea.addEventListener('paste', (event: Event) => {
    if (event instanceof ClipboardEvent) {
        handlePaste(event);
    }
});

document.addEventListener('paste', (event: Event) => {
    if (event instanceof ClipboardEvent && outputSection.style.display === 'none') {
        handlePaste(event);
    }
});

copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(markdownOutput.textContent || '');

        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
      <svg class="icon-small" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copied!
    `;

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);

        showStatus('✓ Copied to clipboard!', 'success');
    } catch {
        showStatus('✗ Failed to copy', 'error');
    }
});

clearBtn.addEventListener('click', () => {
    outputSection.style.display = 'none';
    pasteArea.style.display = 'flex';
    markdownOutput.textContent = '';
    pasteArea.focus();
    showStatus('Ready for new content', 'info');
});

pasteArea.addEventListener('click', () => {
    pasteArea.focus();
});

console.log('📋 Clipboard to Markdown is ready!');
console.log('Press Cmd+V (Mac) or Ctrl+V (Windows/Linux) to paste content');
