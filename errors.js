// Custom error objects
// No "AvatarError" necessary as null is a valid response

import logger from "./logger.cjs";

const eList = [
    'ArgError',
    'AssetError',
    'DomainError',
    'UpstreamError'
]

export class AppError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = "AppError";
    }
}

export class Mistake extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class DomainError extends Mistake {
    constructor(domain) {
        super(`Domain "${domain}" not found or missing address records`);
        this.code = 404;
    }
}

export class AssetError extends Mistake {
    constructor(asset) {
        super(`Asset "${asset}" is not supported`);
        this.code = 400;
    }
}

export class ArgError extends Mistake {
    constructor() {
        super("Expected parameter not dound");
        this.code = 400;
    }
}

export class UpstreamError extends Mistake {
    constructor() {
        super("Upstream API returned an unexpected response");
        this.code = 502;
    }
}

export function throwProperly(e) {
    if (eList.includes(e.name)) {
        throw new AppError(e.name, e);
    } else throw e;
}

// Custom error handler for Express
export function show(e, req, res, next) {
    logger.error(e);
    if (e instanceof AppError) {
        const name = e.cause.name;
        const msg = e.cause.message;
        const code = e.cause.code;
        return res.status(code).send(`${name}: ${msg}`);
    } else return res.status(500).send(`Unexpected API Error: ${e}`);
}