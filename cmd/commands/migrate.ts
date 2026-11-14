export const migrateCommand = async () => {
    const { client } = await import('../../internal/db')

    try {
        const { runMigrations } = await import('../../internal/db/migrate')
        runMigrations()
    } finally {
        client.close()
    }
}

