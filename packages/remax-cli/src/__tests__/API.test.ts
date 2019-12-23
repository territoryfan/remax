import * as path from 'path';

process.chdir(path.join(__dirname, 'fixtures/API'));

import yargs from 'yargs';
import getConfig from '../getConfig';
import API from '../API';

const remaxOptions = getConfig();

describe('API', () => {
  beforeAll(() => {
    API.installNodePlugins(remaxOptions);
    API.installAdapterPlugins('alipay');
  });

  it('install plugins in a variety of ways', () => {
    expect(API.configs).toHaveLength(13);
  });

  it('install adapter plugin', () => {
    expect(API.adapter.name).toEqual('alipay');
    expect(API.adapter.packageName).toEqual('remax-alipay');
  });

  it('extends CLI', () => {
    const newYargs = API.extendsCLI({ cli: yargs });
    const argv = newYargs.parse();

    expect(argv.cat).toEqual(33);
  });

  it('getEntries', () => {
    const defaultPage = 'defaultPageFile';
    const defaultImage = 'defaultImage';
    const entries = API.getEntries(
      {
        app: 'defaultApp',
        pages: [defaultPage],
        images: [defaultImage],
      },
      {
        pages: [defaultPage],
      },
      remaxOptions
    );

    expect(entries).toEqual({
      app: path.join(remaxOptions.cwd, remaxOptions.rootDir, 'app.js'),
      pages: [defaultPage, 'page'],
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
      template: '.axml',
      style: '.acss',
      jsHelper: '.sjs',
    });
  });

  it('runtime plugins', () => {
    const plugins = API.getRuntimePlugins(remaxOptions);

    expect(plugins).toHaveLength(2);
  });
});
