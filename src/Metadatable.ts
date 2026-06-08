import { Constructor } from "./Util";

/**
 * @param {*} parentClass
 * @return {module:MetadatableFn~Metadatable}
 */
export type Metadata = Record<string, any>;

export function Metadatable<TBase extends Constructor>(ParentClass: TBase) {
	/**
	 * Mixin for objects which have a `metadata` property
	 * @mixin
	 * @alias module:MetadatableFn~Metadatable
	 */
	return class extends ParentClass {
		metadata?: Metadata;
		/**
		 * Set a metadata value.
		 * Warning: Does _not_ autovivify, you will need to create the parent objects if they don't exist
		 * @param {string} key   Key to set. Supports dot notation e.g., `"foo.bar"`
		 * @param {*}      value Value must be JSON.stringify-able
		 * @throws Error
		 * @throws RangeError
		 * **Fires**: Metadatable#metadataUpdate
		 */
		setMeta(key: string, value: any) {
			if (!this.metadata) {
				throw new Error("Class does not have metadata property");
			}

			const parts = key.split(".");
			const last = parts.pop() as string;
			let cur = this.metadata;
			for (const part of parts) {
				if (!(part in cur)) {
					cur[part] = {};
				}
				cur = cur[part];
			}

			cur[last] = value;
			/**
			 * @event Metadatable#metadataUpdate
			 * @param {string} key
			 * @param {*} value
			 */
			this.emit("metadataUpdate", key, value);
		}

		/**
		 * Get metadata by key
		 * @param {string} key Supports dot notation
		 * @return {*}
		 */
		getMeta(key: string) {
			if (!this.metadata) {
				return undefined;
			}

			const parts = key.split(".");
			let cur: any = this.metadata;
			for (const part of parts) {
				if (!(part in cur)) {
					return undefined;
				}
				cur = cur[part];
			}

			return cur;
		}
	};
}
