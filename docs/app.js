const pasteArea = document.getElementById('pasteArea');
const outputSection = document.getElementById('outputSection');
const markdownOutput = document.getElementById('markdownOutput');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const status = document.getElementById('status');

pasteArea.focus();

function showStatus(message, type = 'info') {
  status.textContent = message;
  status.className = `status ${type}`;
  status.style.display = 'block';
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

function createTurndownService() {
  const turndownService = new TurndownService(getTurndownOptions());
  addConfluenceRules(turndownService);
  return turndownService;
}

function convertToMarkdown(html) {
  const turndownService = createTurndownService();
  return turndownService.turndown(html);
}

async function handlePaste(event) {
  event.preventDefault();
  
  const clipboardData = event.clipboardData || window.clipboardData;
  
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

pasteArea.addEventListener('paste', handlePaste);

document.addEventListener('paste', (event) => {
  if (outputSection.style.display === 'none') {
    handlePaste(event);
  }
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(markdownOutput.textContent);
    
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
  } catch (error) {
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
