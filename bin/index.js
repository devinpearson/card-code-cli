#!/usr/bin/env node
require('dotenv').config();
var process = require('process');
var fs = require('fs');
var path = require('path');
var emu = require('programmable-card-code-emulator');
const chalk = require('chalk');
const { hideBin } = require('yargs/helpers');
const { getAccessToken, fetchCode, uploadCode, fetchEnv, uploadEnv, fetchCards} = require('../src/api.js');

var argv = require('yargs/yargs')(hideBin(process.argv))
  //.usage('Usage: $0 [options]')
  .usage('$0 <cmd> [args]')
  .command('run', 'run your code locally', (yargs) => {
    yargs.positional('template', {
        alias: 't',
        describe: 'template to run',
        default: 'empty',
        type: 'string',
      })
      .positional('amount', {
        alias: 'a',
        describe: 'amount in cents',
        default: 10000,
        type: 'number',
      })
      .positional('currency', {
        alias: 'c',
        describe: 'currency code',
        default: 'zar',
        type: 'string',
      })
      .positional('mcc', {
        alias: 'e',
        describe: 'merchant category code',
        default: '0000',
        type: 'string',
      })
      .positional('merchant', {
        alias: 'm',
        describe: 'merchant name',
        default: 'The Coders Bakery',
        type: 'string',
      })
      .positional('city', {
        alias: 'i',
        describe: 'merchant city',
        default: 'Cape Town',
        type: 'string',
      })
      .positional('country', {
        alias: 'o',
        describe: 'merchant country',
        default: 'ZA',
        type: 'string',
      })
  }, function (argv) {
    console.log(argv)
    runTemplate(argv)
  })
  .command('fetch-cards', 'List cards', (yargs) => {
  }, async function (argv) {
    try {

        console.log(path.join(__dirname, '..'));
        const token = await getAccessToken(process.env.host, process.env.clientId, process.env.secret, process.env.apikey)
        console.log('fetching cards');
        const result = await fetchCards(process.env.host, token)
        console.table(result);
    } catch (err) {
        console.log(chalk.red(err.message));
    }
  })
  .command('fetch [cardkey] [filename]', 'fetches your code', (yargs) => {
    yargs.positional('cardkey', {
      type: 'integer',
      default: 700615,
      describe: 'the cardkey'
    })
    yargs.positional('filename', {
        type: 'string',
        default: 'data/main.js',
        describe: 'the filename'
      })
  }, async function (argv) {
    try {
        const token = await getAccessToken(process.env.host, process.env.clientId, process.env.secret, process.env.apikey)
        console.log('fetching code');
        const result = await fetchCode(argv.cardkey, process.env.host, token)
        console.log(result);
        await fs.writeFileSync(argv.filename, result);
    } catch (err) {
        console.log(chalk.red(err.message));
    }
  })
  .command('fetch-env [cardkey] [filename]', 'fetches your environmental variables', (yargs) => {
    yargs.positional('cardkey', {
      type: 'string',
      default: '700615',
      describe: 'the cardkey'
    })
    yargs.positional('filename', {
        type: 'string',
        default: 'data/env.json',
        describe: 'the filename'
      })
  }, async function (argv) {
    try {
        const token = await getAccessToken(process.env.host, process.env.clientId, process.env.secret, process.env.apikey)
        console.log('fetching envs');
        const result = await fetchEnv(argv.cardkey, process.env.host, token)
        console.log(result);
        fs.writeFileSync(argv.filename, JSON.stringify(result));
    } catch (err) {
        console.log(chalk.red(err.message));
    }
  })
  .command('upload [cardkey] [filename]', 'pushes your code', (yargs) => {
    yargs.positional('cardkey', {
      type: 'integer',
      default: 700615,
      describe: 'the cardkey'
    })
    yargs.positional('filename', {
        type: 'string',
        default: 'data/main.js',
        describe: 'the filename'
      })
  }, async function (argv) {
    try {
        const token = await getAccessToken(process.env.host, process.env.clientId, process.env.secret, process.env.apikey)
        console.log('uploading code');
        const raw = {"code": ""}
        const code = fs.readFileSync(argv.filename).toString();
        raw.code = code;
        const result = await uploadCode(argv.cardkey, raw, process.env.host, token)
        console.log(result);
    } catch (err) {
        console.log(chalk.red(err.message));
    }
  })
  .command('upload-env [cardkey] [filename]', 'pushes your environmental variables', (yargs) => {
    yargs.positional('cardkey', {
      type: 'integer',
      default: 700615,
      describe: 'the cardkey'
    })
    yargs.positional('filename', {
        type: 'string',
        default: 'data/env.json',
        describe: 'the filename'
      })
  }, async function (argv) {
    try {
        // check that file exists
        if (!fs.existsSync(argv.filename)) {
            throw new Error('File does not exist');
        }
        const token = await getAccessToken(process.env.host, process.env.clientId, process.env.secret, process.env.apikey)
        console.log('uploading env');
        const raw = {"variables": {}}
        const variables = fs.readFileSync(argv.filename);
        raw.variables = JSON.parse(variables);
        const result = await uploadEnv(argv.cardkey, raw, process.env.host, token)
        console.log(result);
    } catch (err) {
        console.log(chalk.red(err.message));
    }
  })
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version').argv;

(async () => {
    // const token = getAccessToken(process.env.host, process.env.clientId, process.env.secret, process.env.apiKey);
})();

async function runTemplate(argv) {
    const template = argv.template;
const templatePath = path.join(path.resolve(), 'templates', template);
if (!fs.existsSync(templatePath)) {
  // The template doesnt exist, process exit
  console.log(chalk.red(`Template ${template} does not exist`));
  process.exit(0);
}
    console.log(chalk.white(`Running template:`), chalk.blueBright(template));
  const transaction = emu.createTransaction(
    argv.currency,
    argv.amount,
    argv.mcc,
    argv.merchant,
    argv.city,
    argv.country
  );
  console.log(chalk.blue(`currency:`), chalk.green(transaction.currencyCode));
  console.log(chalk.blue(`amount:`), chalk.green(transaction.centsAmount));
  console.log(chalk.blue(`merchant code:`), chalk.green(transaction.merchant.category.code));
  console.log(chalk.blue(`merchant name:`), chalk.greenBright(transaction.merchant.name));
  console.log(chalk.blue(`merchant city:`), chalk.green(transaction.merchant.city));
  console.log(chalk.blue(`merchant country:`), chalk.green(transaction.merchant.country.code));
  // Read the template env.json file and replace the values with the process.env values
  let environmentvariables = JSON.parse(
    fs.readFileSync(path.join(templatePath, 'env.json'), 'utf8')
  );
  for (const key in environmentvariables) {
    if (`${key}` in process.env) {
      environmentvariables[`${key}`] = process.env[`${key}`];
    }
  }
  // Convert the environmentvariables to a string
  environmentvariables = JSON.stringify(environmentvariables);
  const code = fs.readFileSync(path.join(templatePath, 'main.js'), 'utf8');
  // Run the code
  const executionItems = await emu.run(transaction, code, environmentvariables);
  executionItems.forEach((item) => {
    console.log('\n💻 ', chalk.green(item.type));
    item.logs.forEach((log) => {
      console.log('\n', chalk.yellow(log.level), chalk.white(log.content));
    });
  });
}