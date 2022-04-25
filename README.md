<h1 align="center">FinENSe</h1>
<div align="center"><img alt="finense logo" style="width:62.5%; height: auto" src="finense_new_logo.png"></div>
<p align ="center">
  <i>RESTful API to aggregate ENS records and estimate net worth</i>
</p>
<div align="center">
  <a href="LICENSE"><img alt="License badge" src="https://img.shields.io/github/license/snorper/finense?color=brightgreen"></a>
  <a href="https://github.com/snorper/finense/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/snorper/finense?color=brightgreen"></a>
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/snorper/finense?color=brightgreen">
</div>

## Notes on Version 2
The original implementation of this software was written in Go and reliant on `go-ens`, which unfortunately was not suitable for the necessary functionality. Version 2 instead uses `ethers.js` to interact with the Ethereum Name Service. Initial development of the JavaScript implementation was done in a [separate repository](https://github.com/snorper/finense-old), now archived, until it approximately reached feature parity with Version 1. Please see that repository for preliminary commits on this version, or older commits in this repository for the antiquated Go implementation.

## Table of Contents
- [Notes on Version 2](#notes-on-version-2)
- [Purpose](#purpose)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Self-Hosting](#self-hosting)
- [Roadmap](#roadmap)
- [License](#license)

## Purpose
*Finense* aims to simplify the process of evaluating one's cryptocurrency portfolio using ENS domains. As of now, the intent is to provide both an API and a convenient web frontend to display information regarding supported assets. The original goal of this software was to evaluate a domain's "Net Worth" in USD; this goal has been satisfied. This software is *not* built to allow any modification of ENS or blockchain data and only `GET` requests are supported.

This software was created to meet a personal need, although the utility is self-evident.

## Usage
A public implementation of the API with proper documentation is forthcoming, so allowed routes are listed here with brief descriptions in the meantime:

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
- [ ] Testing
    - [X] Affirm implementation of all necessary error handling
    - [X] Implement proper logging
    - [X] Implement all necessary tests
    - [ ] Automate testing with GitHub workflows
- [ ] Fully document API
- [ ] Build a user-friendly web frontend
- [ ] Deploy API for public use

## License
All original software within this repository is licensed under the GPL-3.0 License.