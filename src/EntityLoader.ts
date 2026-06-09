export interface IEntityLoaderConfig {
	area?: string;
	bundle?: string;
	path?: string;
	db?: string;
}

export interface IDataSource {
	name: string;
	resolvePath(config: { path: string; bundle: string; area: string }): string;
	hasData(config: IEntityLoaderConfig): Promise<boolean>;
	fetchAll?(config: IEntityLoaderConfig): Promise<unknown[]>;
	fetch?(config: IEntityLoaderConfig, id: string | number): Promise<unknown>;
	replace?(config: IEntityLoaderConfig, data: unknown): Promise<void>;
	update?(
		config: IEntityLoaderConfig,
		id: string | number,
		data: unknown
	): Promise<void>;
	delete?(config: IEntityLoaderConfig, id: string | number): Promise<void>;
}

/**
 * Used to CRUD an entity from a configured DataSource
 */
export class EntityLoader {
	dataSource: IDataSource;
	config: IEntityLoaderConfig;

	/**
	 * @param {DataSource} dataSource
	 * @param {object} config
	 */
	constructor(dataSource: IDataSource, config: IEntityLoaderConfig = {}) {
		this.dataSource = dataSource;
		this.config = config;
	}

	setArea(name: string) {
		this.config.area = name;
	}

	setBundle(name: string) {
		this.config.bundle = name;
	}

	hasData(): Promise<boolean> {
		return this.dataSource.hasData(this.config);
	}

	fetchAll(): Promise<unknown[]> {
		if (!this.dataSource.fetchAll) {
			throw new Error(`fetchAll not supported by ${this.dataSource.name}`);
		}

		return this.dataSource.fetchAll(this.config);
	}

	fetch(id: string | number): Promise<unknown> {
		if (!this.dataSource.fetch) {
			throw new Error(`fetch not supported by ${this.dataSource.name}`);
		}

		return this.dataSource.fetch(this.config, id);
	}

	replace(data: unknown): Promise<void> {
		if (!this.dataSource.replace) {
			throw new Error(`replace not supported by ${this.dataSource.name}`);
		}

		return this.dataSource.replace(
			this.config,
			data
		) as unknown as Promise<void>;
	}

	update(id: string | number, data: unknown): Promise<void> {
		if (!this.dataSource.update) {
			throw new Error(`update not supported by ${this.dataSource.name}`);
		}

		return this.dataSource.update(
			this.config,
			id,
			data
		) as unknown as Promise<void>;
	}

	delete(id: string | number): Promise<void> {
		if (!this.dataSource.delete) {
			throw new Error(`delete not supported by ${this.dataSource.name}`);
		}

		return this.dataSource.delete(this.config, id) as unknown as Promise<void>;
	}
}
