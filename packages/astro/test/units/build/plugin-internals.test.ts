import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { pluginInternals } from '../../../dist/core/build/plugins/plugin-internals.js';

describe('pluginInternals', () => {
	describe('configEnvironment', () => {
		// Create a minimal mock for the plugin factory arguments
		const mockOptions = { settings: { config: { build: { assets: '_astro' } } } } as any;
		const mockInternals = { clientInput: new Set() } as any;
		const plugin = pluginInternals(mockOptions, mockInternals);
		const configEnvironment = plugin.configEnvironment!;

		it('externalizes satteri for prerender environment', () => {
			const config = configEnvironment('prerender');
			const external = config?.build?.rollupOptions?.external;
			assert.ok(Array.isArray(external), 'external should be an array');
			assert.ok(
				external.includes('satteri'),
				'satteri should be in the external list for prerender',
			);
		});

		it('externalizes @astrojs/markdown-satteri for prerender environment', () => {
			const config = configEnvironment('prerender');
			const external = config?.build?.rollupOptions?.external;
			assert.ok(Array.isArray(external), 'external should be an array');
			assert.ok(
				external.includes('@astrojs/markdown-satteri'),
				'@astrojs/markdown-satteri should be in the external list for prerender',
			);
		});

		it('externalizes sharp for prerender environment', () => {
			const config = configEnvironment('prerender');
			const external = config?.build?.rollupOptions?.external;
			assert.ok(Array.isArray(external), 'external should be an array');
			assert.ok(
				external.includes('sharp'),
				'sharp should be in the external list for prerender',
			);
		});

		it('returns undefined for non-prerender environments', () => {
			assert.equal(configEnvironment('client'), undefined);
			assert.equal(configEnvironment('ssr'), undefined);
		});
	});
});
