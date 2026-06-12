import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mergeInlineCss } from '../../../dist/core/build/runtime.js';

describe('mergeInlineCss', () => {
	it('merges two inline stylesheets into one', () => {
		const result = [
			{ type: 'inline' as const, content: '.a{color:red}' },
			{ type: 'inline' as const, content: '.b{color:blue}' },
		].reduce(mergeInlineCss, []);

		assert.equal(result.length, 1);
		assert.equal(result[0].type, 'inline');
		assert.equal(
			(result[0] as { type: 'inline'; content: string }).content,
			'.a{color:red}.b{color:blue}',
		);
	});

	it('does not merge inline and external stylesheets', () => {
		const result = [
			{ type: 'inline' as const, content: '.a{color:red}' },
			{ type: 'external' as const, src: '/style.css' },
			{ type: 'inline' as const, content: '.b{color:blue}' },
		].reduce(mergeInlineCss, []);

		assert.equal(result.length, 3);
	});

	it('hoists @import rules to the top of merged inline CSS', () => {
		const result = [
			{ type: 'inline' as const, content: '.shared{color:red}' },
			{
				type: 'inline' as const,
				content: '@import"https://fonts.example.com/font.css";.button{font-family:Custom}',
			},
		].reduce(mergeInlineCss, []);

		assert.equal(result.length, 1);
		const content = (result[0] as { type: 'inline'; content: string }).content;
		assert.ok(
			content.startsWith('@import"https://fonts.example.com/font.css";'),
			`Expected CSS to start with @import, got: ${content}`,
		);
		assert.ok(
			content.includes('.shared{color:red}'),
			'Expected merged CSS to contain shared styles',
		);
		assert.ok(
			content.includes('.button{font-family:Custom}'),
			'Expected merged CSS to contain button styles',
		);
	});

	it('hoists multiple @import rules', () => {
		const result = [
			{ type: 'inline' as const, content: '.a{color:red}' },
			{ type: 'inline' as const, content: '@import"font1.css";.b{color:blue}' },
			{ type: 'inline' as const, content: '@import"font2.css";.c{color:green}' },
		].reduce(mergeInlineCss, []);

		assert.equal(result.length, 1);
		const content = (result[0] as { type: 'inline'; content: string }).content;
		const importIndex1 = content.indexOf('@import"font1.css"');
		const importIndex2 = content.indexOf('@import"font2.css"');
		const ruleIndex = content.indexOf('.a{color:red}');
		assert.ok(importIndex1 < ruleIndex, '@import should appear before regular rules');
		assert.ok(importIndex2 < ruleIndex, '@import should appear before regular rules');
	});

	it('handles @import with url() syntax', () => {
		const result = [
			{ type: 'inline' as const, content: '.a{color:red}' },
			{ type: 'inline' as const, content: '@import url("https://fonts.example.com/font.css");.b{color:blue}' },
		].reduce(mergeInlineCss, []);

		assert.equal(result.length, 1);
		const content = (result[0] as { type: 'inline'; content: string }).content;
		assert.ok(
			content.startsWith('@import url("https://fonts.example.com/font.css");'),
			`Expected CSS to start with @import url(), got: ${content}`,
		);
	});

	it('does not alter CSS without @import rules', () => {
		const result = [
			{ type: 'inline' as const, content: '.a{color:red}' },
			{ type: 'inline' as const, content: '.b{color:blue}' },
			{ type: 'inline' as const, content: '.c{color:green}' },
		].reduce(mergeInlineCss, []);

		assert.equal(result.length, 1);
		assert.equal(
			(result[0] as { type: 'inline'; content: string }).content,
			'.a{color:red}.b{color:blue}.c{color:green}',
		);
	});
});
