// Script to replace __APP_VERSION__ in public/app.js with the version from package.json
const fs = require('fs');
const path = require('path');

const appJsPath = path.resolve(__dirname, '../public/app.js');
const pkgPath = path.resolve(__dirname, '../package.json');

const version = require(pkgPath).version;

let appJs = fs.readFileSync(appJsPath, 'utf8');
appJs = appJs.replace(/__APP_VERSION__/g, version);
fs.writeFileSync(appJsPath, appJs);

console.log(`Injected version ${version} into public/app.js`);