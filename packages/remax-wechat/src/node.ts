import { RemaxNodePlugin } from 'remax-cli';

const plugin: RemaxNodePlugin = () => {
  return {
    extensions: {
      jsHelper: '.wxs',
      style: '.wxss',
      template: '.wxml',
    },
  };
};

export default plugin;
