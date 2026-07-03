import { logger } from '../lib/logger'

export const logError = (message: string, error: unknown) => {
    logger.error(message, error)
}
