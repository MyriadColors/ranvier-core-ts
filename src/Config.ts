let __cache: Record<string, unknown> | null = null;

/**
 * Access class for the `ranvier.json` config
 */
export class Config {
	/**
	 * @param {string} key
	 * @param {*} fallback fallback value
	 */
	static get<T = unknown>(key: string, fallback?: T): T {
		if (!__cache) {
			return fallback as T;
		}
		return (key in __cache ? __cache[key] : fallback) as T;
	}

	/**
	 * Load `ranvier.json` from disk
	 */
	static load(data: Record<string, unknown>) {
		__cache = data;
	}
}
