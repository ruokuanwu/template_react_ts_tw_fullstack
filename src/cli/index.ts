import { logger } from '../lib/logger'

const command = Bun.argv[2]

switch (command) {
    case 'migrate':
        await import('./commands/migrate')
        break
    case 'cron':
        await import('./commands/cron')
        break
    default:
        logger.info('Available commands: migrate, cron')
        process.exit(command ? 1 : 0)
}
