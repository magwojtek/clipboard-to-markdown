import { describe, it } from 'mocha';
import assert from 'assert';
import pkg from '../../package.json';
import { createTurndownService } from '../lib/turndownConfig';

describe('Server Module', () => {
    it('server module can be required', async () => {
        assert.doesNotThrow(async () => {
            await import('../server');
        }, 'Server file should be loadable');
    });
});

describe('Package Configuration', () => {
    it('package.json has required fields', () => {
        assert.ok(pkg.name, 'Package should have a name');
        assert.ok(pkg.version, 'Package should have a version');
        assert.ok(pkg.dependencies, 'Package should have dependencies');
        assert.ok(pkg.dependencies.express, 'Should depend on express');
        assert.ok(pkg.dependencies.turndown, 'Should depend on turndown');
    });
});

describe('Turndown Configuration', () => {
    it('turndownConfig module exports createTurndownService', () => {
        assert.ok(createTurndownService, 'Should export createTurndownService');
        assert.strictEqual(
            typeof createTurndownService,
            'function',
            'createTurndownService should be a function'
        );
    });
});
