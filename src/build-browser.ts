#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const rulesDir = path.join(srcDir, 'lib', 'rules');
const outputFile = path.join(projectRoot, 'docs', 'turndownRules.js');

const allFiles = fs.readdirSync(rulesDir);
const ruleFiles = allFiles
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts' && file !== 'README.md')
    .sort();

console.log(`Found ${ruleFiles.length} rule files:`, ruleFiles);

let bundleContent = '// Browser-compatible Turndown rules bundle\n';
bundleContent += '// Auto-generated from lib/rules/ - DO NOT EDIT MANUALLY\n';
bundleContent += '// Run: yarn build:browser to regenerate\n\n';

const ruleFunctionNames: string[] = [];

ruleFiles.forEach((file: string) => {
    const filePath = path.join(rulesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const functionMatch = content.match(/function\s+(\w+)\s*\(/);
    if (functionMatch) {
        ruleFunctionNames.push(functionMatch[1]);
    }

    content = content
        .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
        .replace(/export\s+default\s+\w+;?\s*/g, '')
        .replace(/export\s*\{[^}]*\};?\s*/g, '')
        .replace(/:\s*string\[\]\[\]/g, '')
        .replace(/:\s*string\[\]/g, '')
        .replace(/:\s*number\[\]/g, '')
        .replace(/:\s*TurndownService/g, '')
        .replace(/:\s*void/g, '')
        .replace(/:\s*boolean/g, '')
        .replace(/:\s*string/g, '')
        .replace(/:\s*HTMLElement/g, '')
        .replace(/:\s*any/g, '')
        .replace(/:\s*number/g, '')
        .replace(/as\s+HTMLInputElement\s*\|\s*null/g, '')
        .replace(/as\s+HTMLElement/g, '');

    bundleContent += content.trim() + '\n\n';
});

const turndownRulesPath = path.join(srcDir, 'lib', 'turndownRules.ts');
let turndownRulesContent = fs.readFileSync(turndownRulesPath, 'utf8');

const getTurndownOptionsMatch = turndownRulesContent.match(
    /export\s+function\s+getTurndownOptions\(\)[^{]*\{[\s\S]*?\n\}/
);
if (getTurndownOptionsMatch) {
    let optionsFunc = getTurndownOptionsMatch[0]
        .replace(/export\s+/, '')
        .replace(/:\s*Options/g, '');
    bundleContent += optionsFunc + '\n\n';
}

const sortedRuleCalls = [...ruleFunctionNames].sort((a, b) => {
    if (a === 'confluenceCodeBlock') return 1;
    if (b === 'confluenceCodeBlock') return -1;
    return 0;
});
const ruleCalls = sortedRuleCalls.map((name) => `  ${name}(turndownService);`).join('\n');

bundleContent += `// Main function to add all rules
function addConfluenceRules(turndownService) {
${ruleCalls}
}
`;

fs.writeFileSync(outputFile, bundleContent);

console.log('✓ Browser bundle generated successfully at docs/turndownRules.js');
