export const serveCommand = async () => {
    const { runApp } = await import('../../internal/app/run')
    runApp()
}
