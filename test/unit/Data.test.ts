import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import fs from 'node:fs';
import yaml from 'js-yaml';
import { Data } from '../../src/Data';

vi.mock('node:fs', () => {
    return {
        default: {
            existsSync: vi.fn(),
            readFileSync: vi.fn(),
            writeFileSync: vi.fn(),
            realpathSync: vi.fn(),
            statSync: vi.fn(),
        },
    };
});
vi.mock('js-yaml', () => {
    return {
        default: {
            load: vi.fn(),
            dump: vi.fn(),
        },
    };
});

describe('Data', () => {
    const mockDataPath = '/tmp/data/';

    beforeEach(() => {
        vi.clearAllMocks();
        Data.setDataPath(mockDataPath);
    });

    describe('parseFile', () => {
        it('should throw if file does not exist', () => {
            (fs.existsSync as Mock).mockReturnValue(false);
            expect(() => Data.parseFile('missing.json')).toThrow(/does not exist/);
        });

        it('should throw if file has invalid extension', () => {
            (fs.existsSync as Mock).mockReturnValue(true);
            (fs.realpathSync as Mock).mockReturnValue('invalid.txt');
            (fs.readFileSync as Mock).mockReturnValue(Buffer.from('content'));
            expect(() => Data.parseFile('invalid.txt')).toThrow(/valid parser/);
        });

        it('should parse json files', () => {
            const data = { foo: 'bar' };
            (fs.existsSync as Mock).mockReturnValue(true);
            (fs.realpathSync as Mock).mockReturnValue('test.json');
            (fs.readFileSync as Mock).mockReturnValue(Buffer.from(JSON.stringify(data)));
            
            expect(Data.parseFile('test.json')).toEqual(data);
        });

        it('should parse yaml files', () => {
            const data = { foo: 'bar' };
            (fs.existsSync as Mock).mockReturnValue(true);
            (fs.realpathSync as Mock).mockReturnValue('test.yaml');
            (fs.readFileSync as Mock).mockReturnValue(Buffer.from('foo: bar'));
            (yaml.load as Mock).mockReturnValue(data);
            
            expect(Data.parseFile('test.yaml')).toEqual(data);
            expect(yaml.load).toHaveBeenCalledWith('foo: bar');
        });
    });

    describe('saveFile', () => {
        it('should throw if file does not exist', () => {
            (fs.existsSync as Mock).mockReturnValue(false);
            expect(() => Data.saveFile('missing.json', {})).toThrow(/does not exist/);
        });

        it('should save json files', () => {
            const data = { foo: 'bar' };
            (fs.existsSync as Mock).mockReturnValue(true);
            
            Data.saveFile('test.json', data);
            
            expect(fs.writeFileSync).toHaveBeenCalledWith('test.json', JSON.stringify(data, null, 2), 'utf8');
        });

        it('should save yaml files', () => {
            const data = { foo: 'bar' };
            (fs.existsSync as Mock).mockReturnValue(true);
            (yaml.dump as Mock).mockReturnValue('foo: bar');
            
            Data.saveFile('test.yaml', data);
            
            expect(yaml.dump).toHaveBeenCalledWith(data);
            expect(fs.writeFileSync).toHaveBeenCalledWith('test.yaml', 'foo: bar', 'utf8');
        });

        it('should call callback after saving', () => {
            (fs.existsSync as Mock).mockReturnValue(true);
            const cb = vi.fn();
            Data.saveFile('test.json', {}, cb);
            expect(cb).toHaveBeenCalled();
        });
    });

    describe('load', () => {
        it('should load player data', () => {
            const data = { name: 'Player1' };
            (fs.existsSync as Mock).mockReturnValue(true);
            (fs.realpathSync as Mock).mockReturnValue(`${mockDataPath}player/p1.json`);
            (fs.readFileSync as Mock).mockReturnValue(Buffer.from(JSON.stringify(data)));

            expect(Data.load('player', 'p1')).toEqual(data);
        });

        it('should load account data', () => {
            const data = { name: 'Account1' };
            (fs.existsSync as Mock).mockReturnValue(true);
            (fs.realpathSync as Mock).mockReturnValue(`${mockDataPath}account/a1.json`);
            (fs.readFileSync as Mock).mockReturnValue(Buffer.from(JSON.stringify(data)));

            expect(Data.load('account', 'a1')).toEqual(data);
        });

        it('should throw for unknown type', () => {
            (fs.existsSync as Mock).mockReturnValue(true);
            expect(() => Data.load('unknown', 'id')).toThrow(/cannot find the data path/);
        });
    });

    describe('save', () => {
        it('should save player data', () => {
            const data = { name: 'Player1' };
            Data.save('player', 'p1', data);
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                `${mockDataPath}player/p1.json`,
                JSON.stringify(data, null, 2),
                'utf8'
            );
        });

        it('should call callback after saving', () => {
            const cb = vi.fn();
            Data.save('player', 'p1', {}, cb);
            expect(cb).toHaveBeenCalled();
        });
    });

    describe('exists', () => {
        it('should return true if file exists', () => {
            (fs.existsSync as Mock).mockReturnValue(true);
            expect(Data.exists('player', 'p1')).toBe(true);
        });
    });

    describe('isScriptFile', () => {
        it('should return true for .js files', () => {
            (fs.statSync as Mock).mockReturnValue({ isFile: () => true });
            expect(Data.isScriptFile('test.js')).toBe(true);
        });

        it('should return false for non-js files', () => {
            (fs.statSync as Mock).mockReturnValue({ isFile: () => true });
            expect(Data.isScriptFile('test.txt')).toBe(false);
        });
    });

    describe('loadMotd', () => {
        it('should load motd', () => {
            (fs.readFileSync as Mock).mockReturnValue(Buffer.from('Welcome!'));
            expect(Data.loadMotd()).toBe('Welcome!');
            expect(fs.readFileSync).toHaveBeenCalledWith(`${mockDataPath}motd`);
        });
    });
});
