import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

let dataPath: string | null = null;

/**
 * Class for loading/parsing data files from disk
 */
export class Data {
	static setDataPath(path: string) {
		dataPath = path;
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
		const parsers = {
			'.yml': yaml.load,
			'.yaml': yaml.load,
			'.json': JSON.parse,
		};

		const ext = path.extname(filepath) as keyof typeof parsers;
		if (!(ext in parsers)) {
			throw new Error(`File [${filepath}] does not have a valid parser!`);
		}

		return parsers[ext](contents);
	}

	/**
	 * Write data to a file
	 * @param {string} filepath
	 * @param {*} data
	 * @param {function} callback
	 */
	static saveFile(
		filepath: string,
		data: unknown,
		callback?: () => void | undefined
	) {
		if (!fs.existsSync(filepath)) {
			throw new Error(`File [${filepath}] does not exist!`);
		}

		const serializers = {
			'.yml': yaml.dump,
			'.yaml': yaml.dump,
			'.json': function (data: unknown) {
				//Make it prettttty
				return JSON.stringify(data, null, 2);
			},
		};

		const ext = path.extname(filepath) as keyof typeof serializers;
		if (!(ext in serializers)) {
			throw new Error(`File [${filepath}] does not have a valid serializer!`);
		}

		const dataToWrite = serializers[ext](data as any);
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
	 * @param {*} data
	 * @param {function} callback
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
				return dataPath + `player/${id}.json`;
			}
			case 'account': {
				return dataPath + `account/${id}.json`;
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
		const motd = fs.readFileSync(dataPath + 'motd').toString('utf8');
		return motd;
	}
}
