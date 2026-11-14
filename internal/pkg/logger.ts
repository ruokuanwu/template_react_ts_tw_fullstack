import pino from 'pino'
import { config } from '../config'

const logLevel = config.debug ? 'debug' : (config.logLevel ?? 'info');

export const Logger = pino({
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
})
