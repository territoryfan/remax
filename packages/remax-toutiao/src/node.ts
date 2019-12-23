import { RemaxNodePlugin } from 'remax-cli';

const plugin: RemaxNodePlugin = () => {
  return {
    extensions: {
      jsHelper: '',
      style: '.ttss',
      template: '.ttml',
    },
  };
};

export default plugin;
