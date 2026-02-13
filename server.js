const express = require('express');
const path = require('path');
const { createTurndownService } = require('./turndownConfig');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// API endpoint to convert HTML to Markdown
app.post('/convert', (req, res) => {
  try {
    const { html } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'No HTML provided' });
    }

    console.log('Received HTML', html);

    const turndownService = createTurndownService();
    const markdown = turndownService.turndown(html);
    
    res.json({ markdown });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

// Only start server if not in test mode
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Clipboard to Markdown converter running!`);
    console.log(`📋 Open your browser at: http://localhost:${PORT}\n`);
  });
}

module.exports = app;
