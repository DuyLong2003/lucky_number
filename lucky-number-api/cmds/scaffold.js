// eslint-disable-next-line import/no-extraneous-dependencies
const prompt = require('prompt-sync')({ sigint: true });
const generateHelper = require('../template/helper');

const logger = require('../src/config/logger');

exports.command = 'scaffold <ver> <name> <schemas...>';
exports.description = 'Create model, controller, routes, validation, test, doc for model <name> with <schemas..> in <version>';

exports.handler = async function (argv) {
  const createConfirm = `Do you wanto create model ${argv.name} with schemas: ${argv.schemas.join(', ')} in version: ${
    argv.ver
  } y/n?: `;
  const choice = prompt(createConfirm);
  if (choice === 'y') {
    try {
      if (await generateHelper.generateScaffold(argv.ver, argv.name, argv.schemas, argv.force)) {
        logger.info('Scaffold created');
      }
    } catch (err) {
      logger.error('Error occur', err);
    }
  } else {
    logger.info('Action canceled');
  }
};
