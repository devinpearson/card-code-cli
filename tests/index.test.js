import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(rootDir, 'bin/index.js');

/**
 * @param {string[]} args
 * @returns {Promise<{ stdout: string, stderr: string, exitCode: number }>}
 */
async function runCli(args) {
  try {
    const { stdout, stderr } = await execFileAsync('node', [cliPath, ...args], {
      cwd: rootDir,
    });
    return { stdout, stderr, exitCode: 0 };
  } catch (error) {
    return {
      stdout: error.stdout ?? '',
      stderr: error.stderr ?? '',
      exitCode: typeof error.code === 'number' ? error.code : 1,
    };
  }
}

function expectTransactionSummary(stdout, expected) {
  expect(stdout).toContain('Running template:');
  expect(stdout).toContain(expected.filename);
  expect(stdout).toContain(`currency:`);
  expect(stdout).toContain(expected.currency);
  expect(stdout).toContain(`amount:`);
  expect(stdout).toContain(String(expected.amount));
  expect(stdout).toContain(`merchant code:`);
  expect(stdout).toContain(expected.mcc);
  expect(stdout).toContain(`merchant name:`);
  expect(stdout).toContain(expected.merchant);
  expect(stdout).toContain(`merchant city:`);
  expect(stdout).toContain(expected.city);
  expect(stdout).toContain(`merchant country:`);
  expect(stdout).toContain(expected.country);
}

describe('cli run', () => {
  it('runs the empty template with default transaction values', async () => {
    const { stdout, exitCode } = await runCli([
      'run',
      'templates/empty/main.js',
      '-e',
      'templates/empty/env.json',
    ]);

    expect(exitCode).toBe(0);
    expectTransactionSummary(stdout, {
      filename: 'templates/empty/main.js',
      currency: 'zar',
      amount: 10000,
      mcc: '0000',
      merchant: 'The Coders Bakery',
      city: 'Cape Town',
      country: 'ZA',
    });
    expect(stdout).toContain('before_transaction');
    expect(stdout).toContain('after_transaction');
    expect(stdout).not.toContain('after_decline');
  });

  it('applies custom transaction arguments', async () => {
    const { stdout, exitCode } = await runCli([
      'run',
      'templates/empty/main.js',
      '-e',
      'templates/empty/env.json',
      '-c',
      'usd',
      '-a',
      '2500',
      '--mcc',
      '5411',
      '-m',
      'Test Mart',
      '-i',
      'Johannesburg',
      '-o',
      'ZA',
    ]);

    expect(exitCode).toBe(0);
    expectTransactionSummary(stdout, {
      filename: 'templates/empty/main.js',
      currency: 'usd',
      amount: 2500,
      mcc: '5411',
      merchant: 'Test Mart',
      city: 'Johannesburg',
      country: 'ZA',
    });
    expect(stdout).toContain('Grocery Stores, Supermarkets');
    expect(stdout).toContain('before_transaction');
    expect(stdout).toContain('after_transaction');
  });

  it('approves limit-amount transactions under the configured maximum', async () => {
    const { stdout, exitCode } = await runCli([
      'run',
      'templates/limit-amount/main.js',
      '-e',
      'templates/limit-amount/env.json',
      '-a',
      '5000',
    ]);

    expect(exitCode).toBe(0);
    expect(stdout).toContain('amount:');
    expect(stdout).toContain('5000');
    expect(stdout).toContain('before_transaction');
    expect(stdout).toContain('after_transaction');
    expect(stdout).not.toContain('after_decline');
  });

  it('declines limit-amount transactions over the configured maximum', async () => {
    const { stdout, exitCode } = await runCli([
      'run',
      'templates/limit-amount/main.js',
      '-e',
      'templates/limit-amount/env.json',
      '-a',
      '15000',
    ]);

    expect(exitCode).toBe(0);
    expect(stdout).toContain('amount:');
    expect(stdout).toContain('15000');
    expect(stdout).toContain('before_transaction');
    expect(stdout).toContain('after_decline');
    expect(stdout).not.toContain('after_transaction');
  });

  it('approves limit-merchants transactions for an allowed merchant', async () => {
    const { stdout, exitCode } = await runCli([
      'run',
      'templates/limit-merchants/main.js',
      '-e',
      'templates/limit-merchants/env.json',
      '-m',
      'Woolworths',
    ]);

    expect(exitCode).toBe(0);
    expect(stdout).toContain('merchant name:');
    expect(stdout).toContain('Woolworths');
    expect(stdout).toContain('before_transaction');
    expect(stdout).toContain('after_transaction');
    expect(stdout).not.toContain('after_decline');
  });

  it('declines limit-merchants transactions for a blocked merchant', async () => {
    const { stdout, exitCode } = await runCli([
      'run',
      'templates/limit-merchants/main.js',
      '-e',
      'templates/limit-merchants/env.json',
      '-m',
      'Random Shop',
    ]);

    expect(exitCode).toBe(0);
    expect(stdout).toContain('merchant name:');
    expect(stdout).toContain('Random Shop');
    expect(stdout).toContain('before_transaction');
    expect(stdout).toContain('after_decline');
    expect(stdout).not.toContain('after_transaction');
  });

  it('reports when the template file does not exist', async () => {
    const { stdout, exitCode } = await runCli([
      'run',
      'missing.js',
      '-e',
      'templates/empty/env.json',
    ]);

    expect(exitCode).toBe(0);
    expect(stdout).toContain('Template missing.js does not exist');
    expect(stdout).not.toContain('Running template:');
  });

  it('reports when the environment file does not exist', async () => {
    const { stdout, stderr, exitCode } = await runCli([
      'run',
      'templates/empty/main.js',
      '-e',
      'missing-env.json',
    ]);

    expect(exitCode).toBe(1);
    expect(stdout).toContain('Running template:');
    expect(`${stdout}\n${stderr}`).toMatch(/ENOENT|no such file or directory/i);
    expect(`${stdout}\n${stderr}`).toContain('missing-env.json');
  });
});

describe('cli help', () => {
  it('lists the run command', async () => {
    const { stdout, exitCode } = await runCli(['--help']);

    expect(exitCode).toBe(0);
    expect(stdout).toContain('run [filename]');
    expect(stdout).toContain('run your code locally');
  });
});
