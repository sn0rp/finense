const pinoLogger = require('pino');

module.exports = pinoLogger(
    {
        level: process.env.PINO_LOG_LEVEL || 'info',
        formatters: {
            level: (label) => {
                return { level: label };
            },
        },
    },
    pinoLogger.destination(`${__dirname}/finense.log`)
);