import { logger } from '../lib/logger'
import { runCleanupJob } from './jobs/cleanup'

const jobs = {
    cleanup: runCleanupJob,
}

const jobName = Bun.argv[2] as keyof typeof jobs | undefined

if (!jobName || !jobs[jobName]) {
    logger.info(`Available cron jobs: ${Object.keys(jobs).join(', ')}`)
    process.exit(jobName ? 1 : 0)
}

jobs[jobName]()
