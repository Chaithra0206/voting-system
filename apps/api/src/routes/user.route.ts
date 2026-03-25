import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { requireAuth } from '../middleware/auth'
import { syncUser } from '../controllers/user.Controller'

const user = new Hono<AppEnv>()

user.post('/sync', requireAuth, syncUser)

export default user
