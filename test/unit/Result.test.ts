import { describe, test, expect } from 'vitest';
import { EngineResultFactory } from '../../src/Result';

describe('EngineResultFactory', () => {
	test('ok() should create a success result', () => {
		const result = EngineResultFactory.ok('success');
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.value).toBe('success');
		}
	});

	test('error() should create an error result', () => {
		const error = new Error('failure');
		const result = EngineResultFactory.error(error);
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toBe(error);
		}
	});

	test('wrap() should wrap a throwing function', () => {
		const throwingFn = () => {
			throw new Error('thrown');
		};
		const wrappedFn = EngineResultFactory.wrap(throwingFn);
		const result = wrappedFn();
		expect(result.ok).toBe(false);
	});

	test('wrap() should wrap a successful function', () => {
		const successFn = () => 'returned';
		const wrappedFn = EngineResultFactory.wrap(successFn);
		const result = wrappedFn();
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.value).toBe('returned');
		}
	});
});
