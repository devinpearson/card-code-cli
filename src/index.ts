#!/usr/bin/env node
import 'dotenv/config'
import process from 'process'
import fs from 'fs'
import path from 'path'
import { run, createTransaction} from 'programmable-card-code-emulator'
import chalk from 'chalk'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { getAccessToken, fetchCode, uploadCode, fetchEnv, uploadEnv, fetchCards} from './api.js'

const host = process.env.host || '';
const clientId = process.env.clientId || '';
const secret = process.env.secret || '';
const apikey = process.env.apikey || '';

yargs(hideBin(process.argv))
  //.usage('Usage: $0 [options]')
  .usage('$0 <cmd> [args]')
  .command('run [filename]', 'run your code locally', (yargs) => {
    yargs.positional('filename', {
        alias: 'f',
        describe: 'file to run',
        default: 'main.js',
        type: 'string',
      })
      .positional('environment', {
        alias: 'e',
        describe: 'env to run',
        default: 'env.json',
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
    // console.log(argv)
    runTemplate(argv)
  })
  .command('fetch-cards', 'List cards', (yargs) => {
  }, async function (argv) {
    try {
        // console.log(path.join(__dirname, '..'));
        const token = await getAccessToken(host, clientId, secret, apikey)
        console.log('fetching cards');
        const result = await fetchCards(host, token)
        console.table(result);
    } catch (err) {
        if (err instanceof Error) {
            console.log(chalk.red(err.message));
        } else {
            console.log(chalk.red('An unknown error occurred'));
        }
    }
  })
  .command('fetch [cardkey] [filename]', 'fetches your code', {
    builder: (yargs) => {
      return yargs
        .positional('cardkey', {
          type: 'number',
          default: 700615,
          describe: 'the cardkey'
        })
        .positional('filename', {
          type: 'string',
          default: 'data/main.js',
          describe: 'the filename'
        });
    },
    handler: async function (argv) {
        try {
            const token = await getAccessToken(host, clientId, secret, apikey)
            console.log('fetching code');
            const result = await fetchCode(argv.cardkey, host, token)
            console.log(result);
            await fs.writeFileSync(argv.filename, result);
        } catch (err) {
            if (err instanceof Error) {
                console.log(chalk.red(err.message, err.stack));
            } else {
                console.log(chalk.red('An unknown error occurred'));
            }
        }
    }
    })
  .command('fetch-env [cardkey] [filename]', 'fetches your environmental variables', {
    builder: (yargs) => {
      return yargs
        .positional('cardkey', {
          type: 'number',
          default: 700615,
          describe: 'the cardkey'
        })
        .positional('filename', {
          type: 'string',
          default: 'data/env.json',
          describe: 'the filename'
        });
    },
    handler: async function (argv: UploadEnv) {
    try {
        const token = await getAccessToken(host, clientId, secret, apikey)
        console.log('fetching envs');
        const result = await fetchEnv(argv.cardkey, host, token)
        console.log(result);
        fs.writeFileSync(argv.filename, JSON.stringify(result));
    } catch (err) {
        if (err instanceof Error) {
            console.log(chalk.red(err.message));
        } else {
            console.log(chalk.red('An unknown error occurred'));
        }
    }
  }})
  .command('upload [cardkey] [filename]', 'pushes your code', {
    builder: (yargs) => {
      return yargs
        .positional('cardkey', {
          type: 'number',
          default: 700615,
          describe: 'the cardkey'
        })
        .positional('filename', {
          type: 'string',
          default: 'data/main.js',
          describe: 'the filename'
        });
    },
    handler: async function (argv: UploadEnv) {
    try {
        const token = await getAccessToken(host, clientId, secret, apikey)
        console.log('uploading code');
        const raw = {"code": ""}
        const code = fs.readFileSync(argv.filename).toString();
        raw.code = code;
        const result = await uploadCode(argv.cardkey, raw, host, token)
        console.log(result);
    } catch (err) {
        if (err instanceof Error) {
            console.log(chalk.red(err.message));
        } else {
            console.log(chalk.red('An unknown error occurred'));
        }
    }
  }})
  .command('upload-env [cardkey] [filename]', 'pushes your environmental variables', {
    builder: (yargs) => {
      return yargs
        .positional('cardkey', {
          type: 'number',
          default: 700615,
          describe: 'the cardkey'
        })
        .positional('filename', {
          type: 'string',
          default: 'data/env.json',
          describe: 'the filename'
        });
    },
    handler: async function (argv: UploadEnv) {
    try {
        // check that file exists
        if (!fs.existsSync(argv.filename)) {
            throw new Error('File does not exist');
        }
        const token = await getAccessToken(host, clientId, secret, apikey)
        console.log('uploading env');
        const raw = {"variables": {}}
        const variables = fs.readFileSync(argv.filename, 'utf8');
        raw.variables = JSON.parse(variables);
        const result = await uploadEnv(argv.cardkey, JSON.stringify(raw), host, token)
        console.log(result);
    } catch (err) {
        if (err instanceof Error) {
            console.log(chalk.red(err.message));
        } else {
            console.log(chalk.red('An unknown error occurred'));
        }
    }
  }})
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version').argv;

  interface UploadEnv {
    filename: string;
    cardkey: number;
  }

(async () => {
    // const token = getAccessToken(process.env.host, process.env.clientId, process.env.secret, process.env.apiKey);
})();
interface RunTemplate {
    filename: string;
    environment: string;
    amount: number;
    currency: string;
    mcc: string;
    merchant: string;
    city: string;
    country: string;
}
async function runTemplate(argv: any) {
    const template = argv.filename;
const templatePath = path.join(path.resolve(), template);
if (!fs.existsSync(templatePath)) {
  // The template doesnt exist, process exit
  console.log(chalk.red(`Template ${template} does not exist`));
  process.exit(0);
}
    console.log(chalk.white(`Running template:`), chalk.blueBright(template));
  const transaction = createTransaction(
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
    fs.readFileSync(path.join(path.resolve(), argv.environment), 'utf8')
  );
  for (const key in environmentvariables) {
    if (`${key}` in process.env) {
      environmentvariables[`${key}`] = process.env[`${key}`];
    }
  }
  // Convert the environmentvariables to a string
  environmentvariables = JSON.stringify(environmentvariables);
  const code = fs.readFileSync(path.join(path.resolve(), argv.filename), 'utf8');
  // Run the code
  const executionItems = await run(transaction, code, environmentvariables);
  executionItems.forEach((item) => {
    console.log('\n💻 ', chalk.green(item.type));
    item.logs.forEach((log) => {
      console.log('\n', chalk.yellow(log.level), chalk.white(log.content));
    });
  });
}