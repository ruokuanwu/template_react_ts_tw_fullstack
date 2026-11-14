import { createApp } from './index'
import { config } from '../config'
import { client } from '../db'
import { logger } from '../pkg/logger'

export const runApp = () => {
    const app = createApp().listen(config.port)
    let stopping = false

    const stop = async () => {
        if (stopping) return
        stopping = true
        process.off('SIGINT', onSignal)
        process.off('SIGTERM', onSignal)

        try {
            await app.stop()
            logger.info('Elysia server stopped')
        } finally {
            client.close()
        }
    }

    const onSignal = () => {
        void stop().catch((error: unknown) => {
            logger.error({ err: error }, 'Failed to stop application')
            process.exitCode = 1
        })
    }

    process.once('SIGINT', onSignal)
    process.once('SIGTERM', onSignal)
    logger.info(`Elysia server is running at ${app.server?.hostname}:${app.server?.port}`)

    return { app, stop }
}

