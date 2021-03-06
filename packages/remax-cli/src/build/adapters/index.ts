import { hostComponents } from 'remax/macro';

export interface Adapter {
  name: string;

  extensions: {
    readonly template: {
      tag: string;
      src: string;
      extension: string;
    };
    readonly style: string;
    readonly jsHelper?: {
      extension: string;
      tag: string;
      src: string;
    };
    readonly include: {
      tag: string;
      src: string;
    };
  };

  templates: {
    component: string;
    page: string;
    base?: string;
    jsHelper?: string;
  };

  hostComponents: typeof hostComponents;

  getNativePropName: (props: any, isNative?: boolean, type?: string) => string;

  getIcons: (config: any) => string[];

  moduleFormat: 'cjs' | 'esm';
}

export default ['alipay', 'wechat', 'toutiao'];
