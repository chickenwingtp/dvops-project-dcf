import winston from 'winston';

declare global {
	var logger: winston.Logger;
}

const logger = winston.createLogger({
level: 'info',
format: winston.format.combine(
winston.format.timestamp(),
winston.format.simple()
),
transports: [
new winston.transports.Console(),
new winston.transports.File({ filename: 'error.log', level: 'error' }),
new winston.transports.File({ filename: 'combined.log' }),
],
});

global.logger = logger;
export default logger;