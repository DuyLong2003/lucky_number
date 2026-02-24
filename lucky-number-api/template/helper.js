/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-template-curly-in-string */
const fs = require('fs');
const readline = require('readline');

const logger = require('../src/config/logger');

const model = './template/model.txt';
const modelIndex = './src/models/index.js';

const service = './template/service.txt';
const serviceIndex = './src/services/index.js';

const controller = './template/controller.txt';
const controllerIndex = './src/controllers/index.js';

const validation = './template/validation.txt';
const validationIndex = './src/validations/index.js';

const route = './template/route.txt';
const routeIndexTemp = './template/routeIndex.txt';
const permisionPath = './src/config/permission.js';

async function processLineByLine(path) {
  const ret = [];
  const fileStream = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    ret.push(line);
  }
  return ret;
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  // eslint-disable-next-line security/detect-non-literal-regexp
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function mapModelSchema(schema) {
  const mappedSchema = schema.map((s) => {
    const [field, type] = s.split(':');
    const ret = `    ${field}: {
      type: ${type}
    }`;
    return ret;
  });
  return mappedSchema.join(',\n');
}

function mapValidationSchema(schema, mode = 1) {
  const mappedSchema = schema.map((s) => {
    const [field, type] = s.split(':');
    let ret;
    if (mode === 1) {
      ret = `    ${field}: Joi.${type.toLowerCase()}().required()`;
    } else {
      ret = `    ${field}: Joi.${type.toLowerCase()}()`;
    }
    return ret;
  });
  return mappedSchema.join(',\n');
}

function mapRouteSchema(schema, mode = 1) {
  const mappedSchema = schema.map((s) => {
    const [field, type] = s.split(':');
    let ret;
    if (mode === 1) {
      ret = ` *               - ${field}`;
    } else if (mode === 2) {
      ret = ` *               ${field}:\n *                 type: ${type.toLowerCase()}\n *                 description: write description, please`;
    } else if (mode === 3) {
      ret = ` *               ${field}: ${field}`;
    } else if (mode === 4) {
      ret = `        ${field}:\n          type: ${type.toLowerCase()}`;
    } else if (mode === 5) {
      ret = `        ${field}: ${field}`;
    }
    return ret;
  });
  return mappedSchema.join('\n');
}

async function writeAlineAfter(path, line, patern, pathDocIfNotExist, contentCheck = undefined) {
  const isNew = !fs.existsSync(path);
  if (isNew) {
    fs.copyFileSync(routeIndexTemp, path);
  }
  // Backup Index file
  fs.copyFileSync(path, `${path}_bak`);
  const lines = await processLineByLine(path);
  if (lines.indexOf(line) !== -1 || (contentCheck && lines.indexOf(contentCheck) !== -1)) {
    return logger.warn(`Found entry ${line} already exist in file`);
  }
  const index = lines.indexOf(patern);
  lines.splice(index, 0, line);
  fs.writeFileSync(path, lines.join('\n'));
}

async function generateModel(version, name, schema, force) {
  logger.info(`Create model ${name} with ${schema} mode force:${force}`);
  let isCreated = false;
  const isExist = fs.existsSync(model);
  if (isExist) {
    const content = fs.readFileSync(model, 'utf8');
    const lname = name[0].toLowerCase() + name.slice(1);

    const parsedModel = mapModelSchema(schema);

    let newModelContent = replaceAll(content, '${lname}', lname);
    newModelContent = replaceAll(newModelContent, '${name}', name);
    newModelContent = replaceAll(newModelContent, '${parsedModel}', parsedModel);

    const path = `./src/models/${lname}.model.js`;
    if (!fs.existsSync(path) || force) {
      fs.writeFileSync(path, newModelContent);

      // Write a line into index file
      const lines = await processLineByLine(modelIndex);
      const modelLine = `module.exports.${name} = require('./${lname}.model');`;
      if (lines.indexOf(modelLine) === -1) {
        fs.appendFileSync(modelIndex, modelLine);
        fs.appendFileSync(modelIndex, '\n');
      } else {
        logger.warn('Found entry in model index, skip');
      }

      isCreated = true;
    } else {
      logger.error(`${path} exist, can not create model`);
    }
  }

  return isCreated;
}

async function generateService(version, name, schema, force) {
  logger.info(`Create service ${name} with ${schema} mode force:${force}`);
  let isCreated = false;
  const isExist = fs.existsSync(service);
  if (isExist) {
    const content = fs.readFileSync(service, 'utf8');
    const lname = name[0].toLowerCase() + name.slice(1);

    let newServiceContent = replaceAll(content, '${lname}', lname);
    newServiceContent = replaceAll(newServiceContent, '${name}', name);

    const path = `./src/services/${lname}.service.js`;
    if (!fs.existsSync(path) || force) {
      fs.writeFileSync(path, newServiceContent);

      // Write a line into index file
      const lines = await processLineByLine(serviceIndex);
      const serviceLine = `module.exports.${lname}Service = require('./${lname}.service');`;
      if (lines.indexOf(serviceLine) === -1) {
        fs.appendFileSync(serviceIndex, serviceLine);
        fs.appendFileSync(serviceIndex, '\n');
      } else {
        logger.warn('Found entry in services index, skip');
      }

      isCreated = true;
    } else {
      logger.error(`${path} exist, can not create service`);
    }
  }

  return isCreated;
}

async function generateController(version, name, schema, force) {
  logger.info(`Create controller ${name} with ${schema} mode force:${force}`);
  let isCreated = false;
  const isExist = fs.existsSync(controller);
  if (isExist) {
    const content = fs.readFileSync(controller, 'utf8');
    const lname = name[0].toLowerCase() + name.slice(1);

    let newControllerContent = replaceAll(content, '${lname}', lname);
    newControllerContent = replaceAll(newControllerContent, '${name}', name);

    const path = `./src/controllers/${lname}.controller.js`;
    if (!fs.existsSync(path) || force) {
      fs.writeFileSync(path, newControllerContent);

      // Write a line into index file
      const lines = await processLineByLine(controllerIndex);
      const controllerLine = `module.exports.${lname}Controller = require('./${lname}.controller');`;
      if (lines.indexOf(controllerLine) === -1) {
        fs.appendFileSync(controllerIndex, controllerLine);
        fs.appendFileSync(controllerIndex, '\n');
      } else {
        logger.warn('Found entry in controller index, skip');
      }

      isCreated = true;
    } else {
      logger.error(`${path} exist, can not create service`);
    }
  }

  return isCreated;
}

async function generateValidation(version, name, schema, force) {
  logger.info(`Create validation ${name} with ${schema} mode force:${force}`);
  let isCreated = false;
  const isExist = fs.existsSync(validation);
  if (isExist) {
    const content = fs.readFileSync(validation, 'utf8');
    const lname = name[0].toLowerCase() + name.slice(1);

    const parsedModel1 = mapValidationSchema(schema, 1);
    const parsedModel0 = mapValidationSchema(schema, 0);

    let newValidationContent = replaceAll(content, '${lname}', lname);
    newValidationContent = replaceAll(newValidationContent, '${name}', name);
    newValidationContent = replaceAll(newValidationContent, '${parsedModel1}', parsedModel1);
    newValidationContent = replaceAll(newValidationContent, '${parsedModel0}', parsedModel0);

    const path = `./src/validations/${lname}.validation.js`;
    if (!fs.existsSync(path) || force) {
      fs.writeFileSync(path, newValidationContent);

      // Write a line into index file
      const lines = await processLineByLine(validationIndex);
      const validationLine = `module.exports.${lname}Validation = require('./${lname}.validation');`;
      if (lines.indexOf(validationLine) === -1) {
        fs.appendFileSync(validationIndex, validationLine);
        fs.appendFileSync(validationIndex, '\n');
      } else {
        logger.warn('Found entry in validation index, skip');
      }

      isCreated = true;
    } else {
      logger.error(`${path} exist, can not create validation`);
    }
  }
  return isCreated;
}

async function generateRoute(version, name, schema, force) {
  logger.info(`Create route ${name} with ${schema} mode force:${force}`);
  let isCreated = false;
  const isExist = fs.existsSync(route);
  if (isExist) {
    const content = fs.readFileSync(route, 'utf8');
    const lname = name[0].toLowerCase() + name.slice(1);
    const uname = name.toUpperCase();
    const parsedModel1 = mapRouteSchema(schema, 1);
    const parsedModel2 = mapRouteSchema(schema, 2);
    const parsedModel3 = mapRouteSchema(schema, 3);

    let newRouteContent = replaceAll(content, '${lname}', lname);
    newRouteContent = replaceAll(newRouteContent, '${uname}', uname);
    newRouteContent = replaceAll(newRouteContent, '${name}', name);
    newRouteContent = replaceAll(newRouteContent, '${parsedSchema1}', parsedModel1);
    newRouteContent = replaceAll(newRouteContent, '${parsedSchema2}', parsedModel2);
    newRouteContent = replaceAll(newRouteContent, '${parsedSchema3}', parsedModel3);

    // Check version folder exist
    const pathFolder = `./src/routes/${version}`;
    if (!fs.existsSync(pathFolder)) {
      fs.mkdirSync(pathFolder);
    }

    const path = `${pathFolder}/${lname}.route.js`;
    if (!fs.existsSync(path) || force) {
      fs.writeFileSync(path, newRouteContent);

      // Write a line into index file
      const indexFile = `${pathFolder}/index.js`;
      const docPath = `${pathFolder}/docs.route.js`;
      const routeImport = `const ${lname}Route = require('./${lname}.route');`;
      const routeDefine = `  {\n    path: '/${lname}s',\n    route: ${lname}Route\n  },`;
      const routeDefineCheck = `    path: '/${lname}s',`;
      await writeAlineAfter(indexFile, routeImport, '// New Route import go here', docPath);
      await writeAlineAfter(indexFile, routeDefine, '  // New Route go here', docPath, routeDefineCheck);

      isCreated = true;
    } else {
      logger.error(`${path} exist, can not create route`);
    }
  }

  return isCreated;
}

async function generatePermistion(version, name) {
  try {
    // Write a line into index file
    // Check version folder exist
    const uName = name.toUpperCase();
    const lName = name[0].toLowerCase() + name.slice(1);
    const pathFolder = `./src/routes/${version}`;
    const permisionDefine = `  // ${name} module permisstion
  ${uName}: {
    GET_${uName}: 'get_${lName}',
    MANAGE_${uName}: 'manage_${lName}',
    DELETE_${uName}: 'delete_${lName}'
  }, \n`;
    const docPath = `${pathFolder}/docs.route.js`;

    const permissionDefineCheck = `   // ${name} module permisstion`;

    await writeAlineAfter(permisionPath, permisionDefine, '  // new permistion in here', docPath, permissionDefineCheck);
    return true;
  } catch (ex) {
    console.log('error generate permission', ex);
  }
  return false;
}

async function generateScaffold(version, name, schema, force) {
  let isGenerated = true;
  logger.info(`Create scaffold ${name} with ${schema} in version: ${version} mode force:${force}`);

  if (!(await generateModel(version, name, schema, force))) {
    isGenerated = false;
  }

  if (!(await generateService(version, name, schema, force))) {
    isGenerated = false;
  }

  if (!(await generateController(version, name, schema, force))) {
    isGenerated = false;
  }

  if (!(await generateValidation(version, name, schema, force))) {
    isGenerated = false;
  }

  if (!(await generateRoute(version, name, schema, force))) {
    isGenerated = false;
  }

  if (!(await generatePermistion(version, name, schema, force))) {
    isGenerated = false;
  }

  return isGenerated;
}

module.exports = {
  generateScaffold,
};
