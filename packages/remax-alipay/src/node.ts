import { RemaxNodePlugin } from 'remax-cli';

const plugin: RemaxNodePlugin = () => {
  return {
    extensions: {
      jsHelper: '.sjs',
      style: '.acss',
      template: '.axml',
    },
  };
};

export default plugin;
