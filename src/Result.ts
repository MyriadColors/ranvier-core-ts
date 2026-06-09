import { Result } from 'typescript-result';

/**
 * Standard Result type for the engine.
 * @template T Success value type
 * @template E Error type, defaults to Error
 */
export type EngineResult<T, E = Error> = Result<T, E>;

/**
 * Result of an action that might fail with a specific reason.
 * Useful for commands, skills, or any game logic that can fail.
 */
export type ActionResult<T = void> = EngineResult<T, Error>;

/**
 * Helper object for creating EngineResults.
 */
export const EngineResultFactory: {
	ok: typeof Result.ok;
	error: typeof Result.error;
	wrap: typeof Result.wrap;
	gen: typeof Result.gen;
} = {
	/**
	 * Create a successful result.
	 */
	ok: Result.ok,

	/**
	 * Create an error result.
	 */
	error: Result.error,

	/**
	 * Wrap a function that might throw an error into one that returns a Result.
	 */
	wrap: Result.wrap,

	/**
	 * Generator-style composition of results.
	 */
	gen: Result.gen,
};
