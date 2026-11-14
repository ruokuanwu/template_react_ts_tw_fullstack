import { Logger } from '../internal/pkg/logger'

const help = `Usage: bun run cli <command>

Commands:
  serve              Start the HTTP server
  migrate            Run database migrations
  cron <job>         Run a cron job (cleanup)
  help               Show this help
`

export const runCli = async (args: string[]) => {
    const [command, ...commandArgs] = args

    if (!command || command === 'help' || command === '--help' || command === '-h') {
        process.stdout.write(help)
        return
    }

    switch (command) {
        case 'serve': {
            if (commandArgs.length) throw new Error('Usage: serve')
            const { serveCommand } = await import('./commands/serve')
            await serveCommand()
            break
        }
        case 'migrate': {
            if (commandArgs.length) throw new Error('Usage: migrate')
            const { migrateCommand } = await import('./commands/migrate')
            await migrateCommand()
            break
        }
        default:
            throw new Error(`Unknown command: ${command}\n${help}`)
    }
}

if (import.meta.main) {
    try {
        await runCli(Bun.argv.slice(2))
    } catch (error) {
        Logger.error({ err: error }, 'Command failed')
        process.exitCode = 1
    }
}

