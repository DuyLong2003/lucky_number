// eslint-disable-next-line import/no-extraneous-dependencies
const yargs = require('yargs/yargs')(process.argv.slice(2));

yargs.usage('This is default template generator\n\nUsage: node $0 [options]');
yargs.help('help');
yargs.alias('help', 'h');
yargs.version('version', '1.0.1');
yargs.alias('version', 'V');
yargs.commandDir('cmds');
yargs.demandCommand(1, 'You need at least one command before moving on');
// eslint-disable-next-line no-unused-expressions
yargs.options({
  force: {
    alias: 'f',
    description: 'Force overidde existing file',
    boolean: true,
    default: false,
  },
}).argv;
