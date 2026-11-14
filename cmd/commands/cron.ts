import { runCronJob } from '../../internal/cron'

export const cronCommand = async (args: string[]) => {
    if (args.length !== 1) throw new Error('Usage: cron <job> (available: cleanup)')
    await runCronJob(args[0])
}

