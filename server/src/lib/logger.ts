const formatMessage = (level: string, message: string) =>
    `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}`

export const logger = {
    info: (message: string) => console.info(formatMessage('info', message)),
    error: (message: string, error?: unknown) =>
        console.error(formatMessage('error', message), error ?? ''),
}
