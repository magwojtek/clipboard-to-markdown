import { describe, it } from 'mocha';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('Browser Bundle', () => {
    it('browser bundle is up-to-date with source rules', function () {
        this.timeout(5000);
        const docsBundle = path.join(__dirname, '..', '..', 'docs', 'turndownRules.js');

        assert.ok(
            fs.existsSync(docsBundle),
            'Browser bundle should exist at docs/turndownRules.js'
        );

        const currentBundle = fs.readFileSync(docsBundle, 'utf8');

        const tempBundle = path.join(__dirname, '..', '..', 'docs', 'turndownRules.js.tmp');
        const originalBundle = path.join(__dirname, '..', '..', 'docs', 'turndownRules.js.bak');

        try {
            fs.renameSync(docsBundle, originalBundle);

            execSync('npm run build:browser', {
                cwd: path.join(__dirname, '..', '..'),
                stdio: 'pipe',
            });

            const freshBundle = fs.readFileSync(docsBundle, 'utf8');

            fs.renameSync(docsBundle, tempBundle);
            fs.renameSync(originalBundle, docsBundle);

            const currentNormalized = currentBundle.replace(/\r\n/g, '\n').trim();
            const freshNormalized = freshBundle.replace(/\r\n/g, '\n').trim();

            assert.strictEqual(
                currentNormalized,
                freshNormalized,
                'Browser bundle is out of date. Run "npm run build:browser" to regenerate it.'
            );

            fs.unlinkSync(tempBundle);
        } catch (error) {
            if (fs.existsSync(originalBundle)) {
                fs.renameSync(originalBundle, docsBundle);
            }
            if (fs.existsSync(tempBundle)) {
                fs.unlinkSync(tempBundle);
            }
            throw error;
        }
    });

    it('browser bundle contains all rule functions', () => {
        const docsBundle = path.join(__dirname, '..', '..', 'docs', 'turndownRules.js');
        const bundleContent = fs.readFileSync(docsBundle, 'utf8');

        const rulesDir = path.join(__dirname, '..', '..', 'src', 'lib', 'rules');
        const ruleFiles = fs
            .readdirSync(rulesDir)
            .filter((file) => file.endsWith('.ts') && file !== 'index.ts');

        ruleFiles.forEach((file) => {
            const filePath = path.join(rulesDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const functionMatch = content.match(/function\s+(\w+)\s*\(/);

            if (functionMatch) {
                const functionName = functionMatch[1];
                assert.ok(
                    bundleContent.includes(`function ${functionName}(`),
                    `Browser bundle should contain function ${functionName} from ${file}`
                );
                assert.ok(
                    bundleContent.includes(`${functionName}(turndownService);`),
                    `Browser bundle should call ${functionName} in addConfluenceRules`
                );
            }
        });
    });

    it('browser bundle has required functions', () => {
        const docsBundle = path.join(__dirname, '..', '..', 'docs', 'turndownRules.js');
        const bundleContent = fs.readFileSync(docsBundle, 'utf8');

        assert.ok(
            bundleContent.includes('function getTurndownOptions()'),
            'Browser bundle should contain getTurndownOptions function'
        );

        assert.ok(
            bundleContent.includes('function addConfluenceRules('),
            'Browser bundle should contain addConfluenceRules function'
        );

        assert.ok(
            bundleContent.includes('// Auto-generated from lib/rules/'),
            'Browser bundle should have auto-generated comment'
        );
    });
});
