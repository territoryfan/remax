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
    expect(API.configs).toHaveLength(6);
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
      app: remaxOptions.cwd,
      pages: [defaultPage, 'page'],
      images: [defaultImage, remaxOptions.cwd],
    });
  });

  it('processProps', () => {
    const props = API.processProps('text', []);

    expect(props).toEqual(['p1', 'p2']);
  });

  it('shouldHostComponentRegister', () => {
    expect(API.shouldHostComponentRegister('view', false)).toBeTruthy();
    expect(API.shouldHostComponentRegister('swiper-item', false)).toBeFalsy();
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

  it('getHostComponents', () => {
    expect(API.getHostComponents()).toBeDefined();
  });

  it('getMeta', () => {
    const extensions = API.getMeta();
    expect(extensions.include).toMatchInlineSnapshot(`
      Object {
        "src": "src",
        "tag": "include",
      }
    `);
    expect(extensions.jsHelper).toMatchInlineSnapshot(`
      Object {
        "extension": ".sjs",
        "src": "from",
        "tag": "import-sjs",
      }
    `);
    expect(extensions.style).toMatchInlineSnapshot(`".acss"`);
    expect(extensions.template).toMatchInlineSnapshot(`
      Object {
        "extension": ".axml",
        "src": "src",
        "tag": "import",
      }
    `);
  });

  it('runtime plugins', () => {
    const plugins = API.getRuntimePlugins(remaxOptions);

    expect(plugins).toHaveLength(1);
  });
});
