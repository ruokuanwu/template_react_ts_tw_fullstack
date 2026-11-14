import pino from 'pino'
import { config } from '../config'

const logLevel = config.debug ? 'debug' : (config.logLevel ?? 'info');

export const logger = pino({
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
})
