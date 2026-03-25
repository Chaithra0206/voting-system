import type { Context } from 'hono'
import type { AppEnv } from '../types'
import { ensureUserExists } from '../services/user.Service'

export const syncUser = async (c: Context<AppEnv>) => {
    const userId = c.get('userId')

    await ensureUserExists(c.env, userId)

    return c.json({ success: true })
}
