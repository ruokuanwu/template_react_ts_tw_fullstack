import { Elysia } from 'elysia'
import { db } from '../db'

export const dbMiddleware = new Elysia({ name: 'db' }).decorate('db', db)
