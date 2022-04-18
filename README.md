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
The original implementation of this software was written in Go and reliant on the `go-ens` module to resolve ENS records. Unfortunately, that module was limited in its ability to satisfy the vision of *Finense*, so another approach was necessary. Version 2 uses `node.js` and `express.js`, as I found `ethers.js` provides the most suitable tools to interact with the Ethereum Name Service. Initial development of the JavaScript implementation was done in a [separate repository](https://github.com/snorper/finense-old), now archived, until it approximately reached feature parity with Version 1. Please see that repository for preliminary commits on this version, or older commits in this repository for the antiquated Go implementation.

## Table of Contents
- [Notes on Version 2](#notes-on-version-2)
- [Purpose](#purpose)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Self-Hosting](#self-hosting)
- [Roadmap](#roadmap)
- [License](#license)

## Purpose
*Finense* aims to simplify the process of evaluating one's cryptocurrency portfolio using ENS domains. As of now, the intent is to provide an API and a convenient web frontend to display amounts owned for supported assets. The end product of this software should be one's "Crypto Net Worth" in USD. This software is *not* built to allow any modification of ENS or blockchain data and only `GET` requests are supported.

This software was created to meet a personal need. For this reason, I assume it may be of value to others.

## Usage
*TO DO*

## Dependencies
*TO DO*

## Self-Hosting
*TO DO*

## Roadmap
- [X] Determine best approach in detail
- [X] Create `README.md` skeleton
- [ ] Communicate with ENS and relevant blockchain APIs to get necessary data
    - [X] Connect to Ethereum & establish resolver for arbitrary domains
    - [X] Resolve domain to list of coin types with address records
    - [X] Filter a domain's coin types list for supported assets
    - [X] Resolve each supported coin type to the given domain's matching address record
    - [X] Get amount owned for each supported asset
    - [ ] Convert amounts owned to USD
    - [ ] Aggregate amounts owned for all supported assets to calculate net worth
- [ ] API Development
    - [X] Create API skeleton
    - [ ] Fill in API routes using ENS scripts
        - [ ] `/:domain`: provide net worth and asset breakdown
        - [X] `/:domain/address`: provide only addresses, for all supported assets
        - [X] `/:domain/amount`: provide only amounts owned for all supported assets
        - [ ] `/:domain/:asset` provide only (all) data for a specific asset
        - [X] `/:domain/:asset/address` provide only address for a specific asset
        - [X] `/:domain/:asset/amount` provide only amount owned for a specific asset
        - [X] `/:domain/:asset/fiat` provide only value in local currency of amount owned for a specific asset
        - [ ] `/:domain/net` provide only net worth
- [ ] Testing
    - [ ] Affirm implementation of all necessary error handling
    - [ ] Implement proper logging
    - [ ] Test blockchain-related code in isolation
    - [ ] Test API code in isolation
    - [ ] Test completed API
    - [ ] Automate testing with GitHub workflows
- [ ] Implement Docker for convenient and consistent deployment
- [ ] Fully document API
- [ ] Build a minimal, user-friendly web frontend
- [ ] Deploy for public use

## License
All original software within this repository is licensed under the GPL-3.0 License.