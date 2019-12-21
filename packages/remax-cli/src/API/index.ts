import yargs from 'yargs';
import * as path from 'path';
import { flatten } from 'lodash';
import { RollupOptions } from 'rollup';
import getConfig, { RemaxOptions } from '../getConfig';
import { Entries } from '../getEntries';
import { existsSync } from 'fs';

export type CLI = typeof yargs;
export type ExtendsCLIOptions = { cli: CLI };
export type GetEntriesOptions = { remaxOptions: RemaxOptions };
export type ExtendsRollupConfigOptions = { rollupConfig: RollupOptions };
export type Extensions = {
  template: string;
  style: string;
  jsHelper: string;
};

export interface RemaxNodePluginConfig {
  /**
   * 定义原生文件对应的后缀名
   * template: 模板文件后缀名
   * style: 样式文件后缀名
   * jsHelper: wxs/sjs 等文件的后缀名
   *
   */
  extensions?: Extensions;
  /**
   * 扩展 CLI 命令
   * @param options
   * @param options.cli yargs 对象
   * @return 返回扩展后的 yargs 对象
   */
  extendsCLI?: (options: ExtendsCLIOptions) => CLI;
  /**
   * 定义 rollup 入口文件
   * @param options
   * @param options.remaxOptions Remax Config 参数
   * @return entries 对象，其中包含：
   * entreis.app app 文件路径
   * entreis.pages pages 文件路径数组
   * entreis.images 额外的图片文件路径数组（通常为定义在 config 文件中的 tabbar 的 icon）
   */
  getEntries?: (options: GetEntriesOptions) => Entries;
  /**
   * 自定义如何处理 app 文件
   * @return babel 插件e
   */
  transformApp?: () => Function;
  /**
   * 自定义如何处理 page 文件
   * @return babel 插件
   */
  transformPage?: () => Function;
  /**
   * 自定义处理 JSX 标签
   * @return babel 插件
   */
  processJSX?: () => Function;
  /**
   * 生成原生文件，包括模板，样式等等
   * @return rollup 插件
   */
  generateNativeFiles?: () => Function;
  /**
   * 扩展 Rollup Config
   * @param options
   * @param options.rollupConfig Remax 生成的 Rollup Options 对象
   * @return 扩展后的 Rollup Options 对象
   *
   */
  extendsRollupConfig?: (options: ExtendsRollupConfigOptions) => RollupOptions;
}

export type RemaxNodePlugin = (options?: any) => RemaxNodePluginConfig;

class API {
  public configs: RemaxNodePluginConfig[] = [];

  public extendsCLI(options: ExtendsCLIOptions) {
    let { cli } = options;
    this.configs.forEach(config => {
      if (typeof config.extendsCLI === 'function') {
        cli = config.extendsCLI({ ...options, cli });
      }
    });

    return cli;
  }

  public getExtensions() {
    const extensions: Extensions = {
      jsHelper: '',
      template: '',
      style: '',
    };

    this.configs.forEach(config => {
      extensions.jsHelper = config.extensions?.jsHelper ?? extensions.jsHelper;
      extensions.template = config.extensions?.template ?? extensions.template;
      extensions.style = config.extensions?.style ?? extensions.style;
    });

    return extensions;
  }

  public getEntries(entries: Entries) {
    this.configs.forEach(config => {
      if (typeof config.getEntries === 'function') {
        const currentEntries = config.getEntries({ remaxOptions: getConfig() });

        entries.app = currentEntries.app ?? entries.app;
        entries.pages = [...entries.pages, ...currentEntries.pages];
        entries.images = [...entries.images, ...currentEntries.images];
      }
    });

    return entries;
  }

  public transformAppPlugins() {
    const babelPlugins: Function[] = [];

    this.configs.forEach(config => {
      if (typeof config.transformApp === 'function') {
        babelPlugins.push(config.transformApp());
      }
    });

    return babelPlugins;
  }

  public transformPagePlugins() {
    const babelPlugins: Function[] = [];

    this.configs.forEach(config => {
      if (typeof config.transformPage === 'function') {
        babelPlugins.push(config.transformPage());
      }
    });

    return babelPlugins;
  }

  public generateNativeFiles() {
    const rollupPlugins: Function[] = [];

    this.configs.forEach(config => {
      if (typeof config.generateNativeFiles === 'function') {
        rollupPlugins.push(config.generateNativeFiles());
      }
    });

    return rollupPlugins;
  }

  public processJSX() {
    const babelPlugins: Function[] = [];

    this.configs.forEach(config => {
      if (typeof config.processJSX === 'function') {
        babelPlugins.push(config.processJSX());
      }
    });

    return babelPlugins;
  }

  public extendsRollupConfig(options: ExtendsRollupConfigOptions) {
    let { rollupConfig } = options;
    this.configs.forEach(config => {
      if (typeof config.extendsRollupConfig === 'function') {
        rollupConfig = config.extendsRollupConfig({ ...options, rollupConfig });
      }
    });

    return rollupConfig;
  }

  public installNodePlugins() {
    const remaxConfig = getConfig();

    remaxConfig.plugins.forEach(plugin => {
      const [name, options] = flatten([plugin]);
      const pluginFn: RemaxNodePlugin | null = this.getNodePlugin(
        name,
        remaxConfig
      );

      if (typeof pluginFn === 'function') {
        this.configs.push(pluginFn(options));
      }
    });
  }

  public getRuntimePlugins() {
    const remaxConfig = getConfig();

    return remaxConfig.plugins.map(plugin => {
      const [id] = flatten([plugin]);
      const packageName = id.startsWith('remax-plugin')
        ? id
        : 'remax-plugin-' + id;

      return packageName + '/runtime';
    });
  }

  private getNodePlugin(id: string | Function, remaxConfig: RemaxOptions) {
    if (typeof id === 'string') {
      const packageName = id.startsWith('remax-plugin')
        ? id
        : 'remax-plugin-' + id;
      const packagePath = path.join(
        remaxConfig.cwd,
        'node_modules',
        packageName,
        'node'
      );

      if (!existsSync(packagePath + '.js')) {
        return null;
      }

      delete require.cache[packagePath];
      return require(packagePath);
    }

    return id;
  }
}

export default new API();
