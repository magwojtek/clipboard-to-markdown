#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rulesDir = path.join(__dirname, 'lib', 'rules');
const outputFile = path.join(__dirname, 'docs', 'turndownRules.js');

const allFiles = fs.readdirSync(rulesDir);
const ruleFiles = allFiles.filter(file => 
  file.endsWith('.js') && file !== 'index.js' && file !== 'README.md'
).sort();

console.log(`Found ${ruleFiles.length} rule files:`, ruleFiles);

let bundleContent = '// Browser-compatible Turndown rules bundle\n';
bundleContent += '// Auto-generated from lib/rules/ - DO NOT EDIT MANUALLY\n';
bundleContent += '// Run: node build-browser.js to regenerate\n\n';

const ruleFunctionNames = [];

ruleFiles.forEach(file => {
  const filePath = path.join(rulesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const functionMatch = content.match(/function\s+(\w+)\s*\(/);
  if (functionMatch) {
    ruleFunctionNames.push(functionMatch[1]);
  }
  
  content = content.replace(/\/\/ Export for Node\.js[\s\S]*$/m, '');
  
  bundleContent += content.trim() + '\n\n';
});

const turndownRulesPath = path.join(__dirname, 'lib', 'turndownRules.js');
let turndownRulesContent = fs.readFileSync(turndownRulesPath, 'utf8');

const getTurndownOptionsMatch = turndownRulesContent.match(/function getTurndownOptions\(\)[\s\S]*?\n}/);
if (getTurndownOptionsMatch) {
  bundleContent += getTurndownOptionsMatch[0] + '\n\n';
}

const ruleCalls = ruleFunctionNames.map(name => `  ${name}(turndownService);`).join('\n');

bundleContent += `// Main function to add all rules
function addConfluenceRules(turndownService) {
${ruleCalls}
}
`;

fs.writeFileSync(outputFile, bundleContent);

console.log('✓ Browser bundle generated successfully at docs/turndownRules.js');
