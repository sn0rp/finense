<h1 align="center"><i>FINENSE</i></h1>
<div align="center"><img alt="finense logo" style="width: 50%; height: auto" src="finense_logo.png"></div>
<p align ="center">
  <i>RESTful API to aggregate ENS records and estimate net worth</i>
</p>
<div align="center">
  <a href="https://github.com/Snorper/finense/actions"><img alt="Workflow" src="https://img.shields.io/github/workflow/status/Snorper/finense/Jest"></a>
  <a href="https://github.com/snorper/finense/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/snorper/finense?color=brightgreen"></a>
  <a href="LICENSE"><img alt="License badge" src="https://img.shields.io/github/license/snorper/finense?color=brightgreen"></a>
  <br>
  <a href="https://github.com/Snorper/finense/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/snorper/finense?style=social"></a>
  <a href="https://github.com/Snorper/finense/watchers"><img alt="GitHub Watchers" src="https://img.shields.io/github/watchers/snorper/finense?style=social"></a>
</div>

## Table of Contents
- [About](#about)
- [Setup](#setup)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Self-Hosting](#self-hosting)
- [Roadmap](#roadmap)
- [License](#license)

## About
*Finense* aims to simplify the process of evaluating one's cryptocurrency portfolio using ENS domains. The original goal of this software was to evaluate a domain's "Net Worth" in USD; this goal has been satisfied with regard to major cryptocurrency assets. This software is *not* built to allow any modification of ENS or blockchain data and only `GET` requests are supported. Functionality is delivered in the form of an API, however there is currently no public deployment.

This software was created to meet a personal need, although the utility is self-evident.

## Setup
These directions assume the user will deploy on a Debian server with Docker. If you just want to run the software with Node, you can simply clone this repository, create the required environment variables (Step 4 below), and run `npm run start`. If you already have Docker and Screen installed, you can skip to Step 4.

1. Deploy a new Debian server, if applicable.
2. Uninstall outdated versions of Docker
```bash
apt remove docker docker-engine docker.io containerd runc
```
3. Install Docker, Git, Screen
```bash
apt update

apt install ca-certificates curl gnupg lsb-release

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin screen git
```
4. Download and configure Finense
```bash
git clone https://github.com/snorper/finense

cd finense

cat >> ./.env<< EOF
INFURA_ID=""
INFURA_SECRET=""
NOW_NODES=""
PORT=5000
NODE_ENV="production"
EOF
```
Regarding the above environment variables:
- INFURA_ID is your *Infura Project ID*.
- INFURA_SECRET is your *Infura Project Secret*.
- NOW_NODES is your *NOWNodes API Key*.
- PORT is the port on which the API will listen (default 5000).
5. Run Finense
```bash
screen -S finense

docker compose up
```
- To exit and leave finense running, press `CTRL+A` and then `D`.
- To return after exiting, run `screen -r finense`.
- To stop finense, run `screen -X -S finense quit`.

## Usage
Proper documentation is forthcoming, so allowed routes are listed here with brief descriptions in the meantime:

- `/domain/{your domain}`: all data exposed by other routes
- `/domain/{your domain}/address`: all supported address records
- `/domain/{your domain}/amount`: balances for all supported address records
- `/domain/{your domain}/avatar`: avatar url (null if not applicable)
- `/domain/{your domain}/net`: net worth of supported address records
- `/domain/{your domain}/{asset ticket}`: address, balance, and USD value for a specific asset
- `/domain/{your domain}/{asset ticket}/address`: address for a specific asset
- `/domain/{your domain}/{asset ticket}/amount`: balance for a specific asset
- `/domain/{your domain}/{asset ticket}/fiat`: USD value of balance for a specific asset

Note that this API currently supports four assets: btc, ltc, eth, doge.

## Dependencies
Proper functionality is dependent upon other upstream APIs remaining accessible. If at any time these APIs cannot be reached, *Finense* is expected to return an "UpstreamError" with status code 502. Beyond this, all routes and underlying functions are tested. Errors should only be returned if the user supplies a dissallowed or misspelled request.

## Roadmap
- [X] Determine best approach in detail
- [X] Create `README.md` skeleton
- [X] Communicate with ENS and relevant blockchain APIs to get necessary data
    - [X] Connect to Ethereum & establish resolver for arbitrary domains
    - [X] Resolve domain to list of coin types with address records
    - [X] Filter a domain's coin types list for supported assets
    - [X] Resolve each supported coin type to the given domain's matching address record
    - [X] Get amount owned for each supported asset
    - [X] Convert amounts owned to USD
    - [X] Aggregate amounts owned for all supported assets to calculate net worth
- [X] API Development
    - [X] Create API skeleton
    - [X] Fill in API routes using ENS scripts
        - [X] `/:domain`: provide net worth and asset breakdown
        - [X] `/:domain/address`: provide only addresses, for all supported assets
        - [X] `/:domain/amount`: provide only amounts owned for all supported assets
        - [X] `/:domain/:asset` provide only (all) data for a specific asset
        - [X] `/:domain/:asset/address` provide only address for a specific asset
        - [X] `/:domain/:asset/amount` provide only amount owned for a specific asset
        - [X] `/:domain/:asset/fiat` provide only value in USD of amount owned for a specific asset
        - [X] `/:domain/net` provide only net worth
- [X] Testing
    - [X] Affirm implementation of all necessary error handling
    - [X] Implement proper logging
    - [X] Implement all necessary tests
    - [X] Automate testing with GitHub workflows
- [X] Implement Docker
- [ ] Fully document API

## License
All original software within this repository is licensed under the GPL-3.0 License.