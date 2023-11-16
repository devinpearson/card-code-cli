#!/usr/bin/env node
require('dotenv').config();
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
var process = require('process');
var fs = require('fs');
var path = require('path');
var emu = require('programmable-card-code-emulator');

yargs(hideBin(process.argv))
  .command(
    'run [template]',
    'run a template',
    (yargs) => {
      return yargs.positional('template', {
        describe: 'template name to run',
        default: 'empty',
      });
    },
    (argv) => {
      if (argv.verbose) console.info(`start server on :${argv.port}`);
      amount = argv.amount ? argv.amount : 10000;
      currency = argv.currency ? argv.currency : 'zar';
      merchantCode = argv.merchantCode ? argv.merchantCode : '5463';
      merchantName = argv.merchantName ? argv.merchantName : 'The Coders Bakery';
      merchantCity = argv.merchantCity ? argv.merchantCity : 'Cape Town';
      merchantCountry = argv.merchantCountry ? argv.merchantCountry : 'ZA';

      template = argv.template;
    }
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .parse();

const templatePath = path.join(path.resolve(), 'templates', template);
if (!fs.existsSync(templatePath)) {
  // console.log(`Template ${template} does not exist`);
  process.exit(0);
}

(async () => {
  const transaction = emu.createTransaction(
    currency,
    amount,
    merchantCode,
    merchantName,
    merchantCity,
    merchantCountry
  );

  let environmentvariables = JSON.parse(
    fs.readFileSync(path.join(templatePath, 'env.json'), 'utf8')
  );
  for (const key in environmentvariables) {
    if (`${key}` in process.env) {
      environmentvariables[`${key}`] = process.env[`${key}`];
    }
  }

  environmentvariables = JSON.stringify(environmentvariables);
  const code = fs.readFileSync(path.join(templatePath, 'main.js'), 'utf8');

  const executionItems = await emu.run(transaction, code, environmentvariables);
  console.log(executionItems);
})();
