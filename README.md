# CLI Programmable Card Code Emulator

Write and test programmable card code in a safe environment.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents
- [About](#about)
- [Templates](#templates)
- [Installation](#installation)
- [DevContainer (VSCode)](#devcontainer-vscode)
- [Docker](#docker)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)
- [Other Projects](#other-projects)

## About

While exploring Programmable Banking Cards, I found it difficult to test my code. I wanted to be able to write code and test it in a safe environment. I also wanted to be able to share my code with others. This project is an attempt to solve these problems.

## Templates

Templates are the code that is run by the emulator. They are written in JavaScript and can be found in the `templates` directory. The template that is run by default is `empty`. This template does nothing and is a good starting point for writing your own templates.

Current Templates:

- `empty` - Does nothing
- `petrol_card` - A template for a petrol card
- `rooty` - A template for a sending a slack message after a transaction
- `telegram` - A template for sending a telegram message after a transaction
- `postman-echo` - A template for sending a transaction to [Postman Echo](https://learning.postman.com/docs/developer/echo-api/)

## Installation
Before installing, [download and install Node.js](https://nodejs.org/en/download/).

```bash
git clone https://github.com/devinpearson/programmable-banking-card-issuer.git
cd programmable-banking-card-issuer
```
```bash
npm install
```
## DevContainer (VSCode)
VS Code will automatically detect the `.devcontainer` folder and prompt you to open the project in a container. This will set up the environment for you to run the server in a Docker container. 
```bash
docker-compose -f .devcontainer/docker-compose.yml up
```

## Docker
    
```bash
docker build -t card-emu .
docker run card-emu -t petrol_card
```
![](./media/docker-example.gif)

### Usage
Commands:
  run [filename]                         run your code locally
  fetch-cards                           list cards
  fetch [cardkey] [filename]             fetches your saved code
  fetch-published [cardkey] [filename]   fetches your published code
  fetch-env [cardkey] [filename]         fetches your environmental variables
  upload [cardkey] [filename]            uploads your code to saved code
  publish [cardkey] [codeid] [filename]  publishes your saved code
  upload-env [cardkey] [filename]        publishes your environmental variables
  toggle [cardkey] [enabled]            enable/disable card code
  executions [cardkey] [filename]        card execution logs

Options:
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

![](./media/card-code-example.gif)

Options:

`-e, --environment [environment]` The environment to use

`-a, --amount [amount]` The amount of the transaction

`-c, --currency [currency]` The currency of the transaction

`--mcc [mcc]` The merchant category code of the transaction

`-m, --merchant [merchant]` The merchant name of the transaction

`-i, --city [city]` The city of the transaction

`-o, --country [country]` The country of the transaction

`-h, --help` Display help for command

`-v, --version` Display the current version

To run a transaction against a template, run the following command:

```
node . main.js -e env.json --amount 60000 --currency ZAR --mcc 0000 --merchant "Test Merchant" --city "Test City" --country ZA
```
## Testing

To run the tests, use the following command:
```bash
npm test
```
## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Contact

For inquiries, please open an issue.

## Acknowledgments

- [Yargs](https://yargs.js.org/)
- [Chalk](https://github.com/chalk/chalk)

## Other Projects
- [Banking API Simulator](https://github.com/devinpearson/programmable-banking-sim)
- [Random banking data generator](https://github.com/devinpearson/programmable-banking-faker)
- [Open Banking Point of Sales device](https://github.com/devinpearson/programmable-banking-pos)
- [Card Issuer](m/devinpearson/programmable-banking-card-issuer)
- [A blockly editor for card code](https://github.com/devinpearson/investec-blockly)
- [A HTTP server for using the card code emulator](https://github.com/devinpearson/investec-card-server)
- [The card code emulator package](https://github.com/devinpearson/programmable-card-code-emulator)