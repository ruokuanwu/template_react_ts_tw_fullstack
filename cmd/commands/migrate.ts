export const migrateCommand = async () => {
    const { runMigrations } = await import('../../internal/app/migrate')
    runMigrations()
}

