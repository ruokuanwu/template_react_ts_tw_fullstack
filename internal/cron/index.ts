import { runCleanupJob } from './jobs/cleanup'

const jobs = {
    cleanup: runCleanupJob,
}

export const runCronJob = async (jobName: string) => {
    if (!Object.prototype.hasOwnProperty.call(jobs, jobName)) {
        throw new Error(`Unknown cron job: ${jobName}. Available jobs: ${Object.keys(jobs).join(', ')}`)
    }

    await jobs[jobName as keyof typeof jobs]()
}

