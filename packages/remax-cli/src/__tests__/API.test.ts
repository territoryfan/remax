import * as path from 'path';

process.chdir(path.join(__dirname, 'fixtures/API'));

import yargs from 'yargs';
import getConfig from '../getConfig';
import API from '../API';

describe('API', () => {
  beforeAll(() => {
    API.installPlugins();
  });

  it('install plugins in a variety of ways', () => {
    expect(API.configs).toHaveLength(12);
  });

  it('extends CLI', () => {
    const newYargs = API.extendsCLI({ cli: yargs });
    const argv = newYargs.parse();

    expect(argv.cat).toEqual(33);
  });

  it('getEntries', () => {
    const defaultPage = {
      path: 'defaultPagePath',
      file: 'defaultPageFile',
    };
    const defaultImage = 'defaultImage';
    const entries = API.getEntries({
      app: 'defaultApp',
      pages: [defaultPage],
      images: [defaultImage],
    });
    const remaxOptions = getConfig();

    expect(entries).toEqual({
      app: remaxOptions.cwd,
      pages: [
        defaultPage,
        {
          path: remaxOptions.cwd,
          file: 'page',
        },
      ],
      images: [defaultImage, remaxOptions.cwd],
    });
  });

  it('transformAppPlugins', () => {
    const babelPlugins = API.transformAppPlugins();

    expect(babelPlugins).toHaveLength(2);
  });

  it('transformPagePlugins', () => {
    const babelPlugins = API.transformPagePlugins();

    expect(babelPlugins).toHaveLength(2);
  });

  it('processJSX', () => {
    const babelPlugins = API.processJSX();

    expect(babelPlugins).toHaveLength(2);
  });

  it('generateNativeFiles', () => {
    const rollupPlugins = API.generateNativeFiles();

    expect(rollupPlugins).toHaveLength(2);
  });

  it('extendsRollupConfig', () => {
    const rollupConfig = API.extendsRollupConfig({
      rollupConfig: {
        treeshake: true,
      },
    });

    expect(rollupConfig).toEqual({
      treeshake: false,
    });
  });

  it('getExtensions', () => {
    const extensions = API.getExtensions();
    expect(extensions).toEqual({
      template: 'axml',
      style: 'axss',
      jsHelper: 'sjs',
    });
  });
});
