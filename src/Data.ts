import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

/**
 * Utility for loading/parsing data files from disk
 */
export class Data {
	private static _dataPath: string | null = null;

	static setDataPath(path: string) {
		this._dataPath = path;
	}

	/**
	 * Read in and parse a file. Current supports yaml and json
	 * @param {string} filepath
	 * @return {unknown} parsed contents of file
	 */
	static parseFile(filepath: string): unknown {
		if (!fs.existsSync(filepath)) {
			throw new Error(`File [${filepath}] does not exist!`);
		}

		const contents = fs
			.readFileSync(fs.realpathSync(filepath))
			.toString('utf8');
		const parsers: Record<string, (contents: string) => unknown> = {
			'.yml': (content: string) => yaml.load(content),
			'.yaml': (content: string) => yaml.load(content),
			'.json': JSON.parse,
		};

		const ext = path.extname(filepath);
		if (!(ext in parsers)) {
			throw new Error(`File [${filepath}] does not have a valid parser!`);
		}

		return parsers[ext](contents);
	}

	/**
	 * Write data to a file
	 * @param {string} filepath
	 * @param {unknown} data
	 * @param {function} [callback]
	 */
	static saveFile(filepath: string, data: unknown, callback?: () => void) {
		if (!fs.existsSync(filepath)) {
			throw new Error(`File [${filepath}] does not exist!`);
		}

		const serializers: Record<string, (data: unknown) => string> = {
			'.yml': (data: unknown) => yaml.dump(data),
			'.yaml': (data: unknown) => yaml.dump(data),
			'.json': (data: unknown) => {
				//Make it prettttty
				return JSON.stringify(data, null, 2);
			},
		};

		const ext = path.extname(filepath);
		if (!(ext in serializers)) {
			throw new Error(`File [${filepath}] does not have a valid serializer!`);
		}

		const dataToWrite = serializers[ext](data);
		fs.writeFileSync(filepath, dataToWrite, 'utf8');

		if (callback) {
			callback();
		}
	}

	/**
	 * load/parse a data file (player/account)
	 * @param {string} type
	 * @param {string} id
	 * @return {unknown}
	 */
	static load(type: string, id: string): unknown {
		return this.parseFile(this.getDataFilePath(type, id));
	}

	/**
	 * Save data file (player/account) data to disk
	 * @param {string} type
	 * @param {string} id
	 * @param {unknown} data
	 * @param {function} [callback]
	 */
	static save(type: string, id: string, data: unknown, callback?: () => void) {
		fs.writeFileSync(
			this.getDataFilePath(type, id),
			JSON.stringify(data, null, 2),
			'utf8'
		);
		if (callback) {
			callback();
		}
	}

	/**
	 * Check if a data file exists
	 * @param {string} type
	 * @param {string} id
	 * @return {boolean}
	 */
	static exists(type: string, id: string) {
		return fs.existsSync(this.getDataFilePath(type, id));
	}

	/**
	 * get the file path for a given data file by type (player/account)
	 * @param {string} type
	 * @param {string} id
	 * @return {string}
	 */
	static getDataFilePath(type: string, id: string) {
		switch (type) {
			case 'player': {
				return `${this._dataPath}player/${id}.json`;
			}
			case 'account': {
				return `${this._dataPath}account/${id}.json`;
			}
			default:
				throw new Error(
					`Data getDataFilePath cannot find the data path for type [${type}]`
				);
		}
	}

	/**
	 * Determine whether or not a path leads to a legitimate JS file or not.
	 * @param {string} path
	 * @param {string} [file]
	 * @return {boolean}
	 */
	static isScriptFile(path: string, file: string = path) {
		return fs.statSync(path).isFile() && !!file.match(/js$/);
	}

	/**
	 * load the MOTD for the intro screen
	 * @return string
	 */
	static loadMotd() {
		const motd = fs.readFileSync(`${this._dataPath}motd`).toString('utf8');
		return motd;
	}
}
