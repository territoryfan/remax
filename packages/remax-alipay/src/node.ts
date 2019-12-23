import * as path from 'path';
import { RemaxNodePlugin, Entries } from 'remax-cli';

const plugin: RemaxNodePlugin = () => {
  return {
    extensions: {
      jsHelper: '.sjs',
      style: '.acss',
      template: '.axml',
    },
    getEntries({ remaxOptions, appManifest, getEntryPath }) {
      const ROOT_DIR = path.join(remaxOptions.cwd, remaxOptions.rootDir);
      const { pages, subPackages = [], tabBar = { items: [] } } = appManifest;

      if (!pages || pages.length === 0) {
        throw new Error('app.config.js|ts 并未配置页面参数');
      }

      const entries: Entries = {
        app: '',
        pages: [],
        images: [],
      };

      // 页面
      entries.pages = pages.reduce(
        (ret: string[], page: string) =>
          [...ret, getEntryPath(path.join(ROOT_DIR, page))].filter(
            page => !!page
          ),
        []
      );

      // 分包页面
      subPackages.forEach((pack: { pages: string[]; root: string }) => {
        entries.pages = entries.pages.concat(
          pack.pages.reduce(
            (ret: string[], page) =>
              [
                ...ret,
                getEntryPath(path.join(ROOT_DIR, pack.root, page)),
              ].filter(page => !!page),
            []
          )
        );
      });

      // tabbar 中的图片
      entries.images = ((tabBar?.items as string[]) || [])
        .reduce(
          (images: string[], tab: any) => [...images, tab.icon, tab.activeIcon],
          []
        )
        .filter((image: any) => !!image)
        .reduce<string[]>(
          (paths, image) => [...paths, path.join(ROOT_DIR, image)],
          []
        );

      return entries;
    },
  };
};

export default plugin;
