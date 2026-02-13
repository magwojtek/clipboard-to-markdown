const { test } = require('node:test');
const assert = require('node:assert');

test('server module can be required', () => {
  assert.doesNotThrow(() => {
    require('./server.js');
  }, 'Server file should be loadable');
});

test('package.json has required fields', () => {
  const pkg = require('./package.json');
  
  assert.ok(pkg.name, 'Package should have a name');
  assert.ok(pkg.version, 'Package should have a version');
  assert.ok(pkg.dependencies, 'Package should have dependencies');
  assert.ok(pkg.dependencies.express, 'Should depend on express');
  assert.ok(pkg.dependencies.turndown, 'Should depend on turndown');
});

test('turndownConfig module exports createTurndownService', () => {
  const turndownConfig = require('./turndownConfig');
  
  assert.ok(turndownConfig.createTurndownService, 'Should export createTurndownService');
  assert.strictEqual(typeof turndownConfig.createTurndownService, 'function', 'createTurndownService should be a function');
});
