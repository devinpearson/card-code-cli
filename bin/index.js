#!/usr/bin/env node
require('dotenv').config();
var process = require('process');
var fs = require('fs');
var path = require('path');
var emu = require('programmable-card-code-emulator');
const chalk = require('chalk');
const { hideBin } = require('yargs/helpers');

var argv = require('yargs/yargs')(hideBin(process.argv))
  .usage('Usage: $0 [options]')
  .option('template', {
    alias: 't',
    describe: 'template to run',
    default: 'empty',
    type: 'string',
  })
  .option('amount', {
    alias: 'a',
    describe: 'amount in cents',
    default: 10000,
    type: 'number',
  })
  .option('currency', {
    alias: 'c',
    describe: 'currency code',
    default: 'zar',
    type: 'string',
  })
  .option('mcc', {
    alias: 'e',
    describe: 'merchant category code',
    default: '0000',
    type: 'string',
  })
  .option('merchant', {
    alias: 'm',
    describe: 'merchant name',
    default: 'The Coders Bakery',
    type: 'string',
  })
  .option('city', {
    alias: 'i',
    describe: 'merchant city',
    default: 'Cape Town',
    type: 'string',
  })
  .option('country', {
    alias: 'o',
    describe: 'merchant country',
    default: 'ZA',
    type: 'string',
  })
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version').argv;
const template = argv.template;
const templatePath = path.join(path.resolve(), 'templates', template);
if (!fs.existsSync(templatePath)) {
  // The template doesnt exist, process exit
  console.log(chalk.red(`Template ${template} does not exist`));
  process.exit(0);
}

(async () => {
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
  //console.log(JSON.stringify(executionItems));
})();
