<h1 align="center">finense</h1>
<p align ="center">
  An API built to programmatically access ENS records.
</p>
<div align="center">
  <a href="LICENSE"><img alt="License badge" src="https://img.shields.io/github/license/snorper/finense?color=brightgreen"></a>
  <a href="https://github.com/snorper/finense/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/snorper/finense?color=brightgreen"></a>
  <a href="https://github.com/Snorper/finense/actions"><img alt="Workflows" src="https://img.shields.io/github/workflow/status/snorper/finense/finense-tests"></a>
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/snorper/finense?color=brightgreen">
  <img alt="Go Version" src="https://img.shields.io/github/go-mod/go-version/snorper/finense?color=brightgreen">
</div>

### Table of Contents
- [Summary](#Summary)
- [Usage](#Usage)
- [Contributing](#Contributing)
- [License](#License)

## Summary
*finense* is a REST API which provides data on records tied to a domain under the Ethereum Name Service. In its current iteration, this tool takes in a potential ENS domain and, if valid, returns the domain, ETH address, amount of ETH owned, and the USD value of ETH owned.

In the future, *finense* will gradually add support for tokens and other ENS-supported address types. However, only *GET* requests will ever be allowed. This tool is not intended to provide interaction with any registrars or blockchains.

### Motivation
As my financial portfolio grows in diversity, it become increasingly tedious to calculute monthly outcome and net worth using a spreadsheet alone. I intend to integrate this API in a future solution to clearly present one's portfolio and net worth on demand. It is my assumption and hope that others may find *finense* useful, as this and the software yet to come will already have a positive impact for at least one user.

## Usage
<p align="center">
    <em>A public implementation of this API is coming soon!</em>
</p>

Until this API is available under a dedicated domain, you can either run `go [build/install]` or build the Dockerfile to use it in your own application. Note that a `.env` file is expected in the project's root directory to provide an Etherscan API key and an Infura project ID, both of which are trivial to acquire.

The API can be reached at port 8080 by default. Either navigate to `http://localhost:8080/YOURNAME.eth` in a browser or otherwise send a *GET* request to view available data:

```
$ curl localhost:8080/YOURNAME.eth
{
    "domain": "YOURNAME.eth",
    "addr": "0x...",
    "eth": "1",
    "usd": "2500"
}
```

## Contributing
While the API currently only returns data on ETH, ENS supports addresses for multiple coin types. However, most other addresses are not encoded in the same manner as ETH addresses, so it will be time-consuming to add support for all. If you are feeling adventurous, please feel free to compare the current top currencies against [this list](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) and submit a pull request after resolving and decoding the next unsupported address type. You may want to consult the documentation for [go-ens](https://github.com/wealdtech/go-ens) as well. Otherwise, general improvements are always welcome.

## License
All original software is licensed under the GPL-3.0 License