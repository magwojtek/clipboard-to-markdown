import express, { Request, Response } from 'express';
import { createTurndownService } from './lib/turndownConfig';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

app.post('/convert', (req: Request, res: Response) => {
    try {
        const { html } = req.body;

        if (!html) {
            return res.status(400).json({ error: 'No HTML provided' });
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Received HTML', html);
        }

        const turndownService = createTurndownService();
        const markdown = turndownService.turndown(html);

        res.json({ markdown });
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({ error: 'Conversion failed' });
    }
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');
const version = pkg.version;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n🚀 Clipboard to Markdown converter v${version} running!`);
        console.log(`📋 Open your browser at: http://localhost:${PORT}\n`);
    });
}

export { app };
