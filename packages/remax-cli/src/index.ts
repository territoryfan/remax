import API from './API';

export { RemaxNodePluginConfig } from './API';

API.installNodePlugins();

import yargs from 'yargs';
import build from './build';
import { checkRemaxVersion } from './checkVersions';

export { RemaxConfig } from './getConfig';

export let cli = yargs;

export function run(args: any, context?: any, callback?: yargs.ParseCallback) {
  checkRemaxVersion();

  cli = yargs
    .scriptName('remax-cli')
    .usage('Usage: $0 <command> [options]')
    .command<any>(
      'build',
      '编译项目',
      () => {
        // ignore
      },
      (argv: any) => build(argv, context)
    );

  cli = API.extendsCLI({ cli });

  cli
    .option('watch', {
      describe: '监听文件变化',
      alias: 'w',
      type: 'boolean',
      default: false,
    })
    .option('target', {
      describe: '目标平台，如 wechat，alipay',
      alias: 't',
      type: 'string',
      required: true,
      requiresArg: true,
    })
    .showHelpOnFail(false);

  return cli.parse(args, callback);
}
