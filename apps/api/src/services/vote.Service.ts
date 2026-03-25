import type { VoteRequest } from '@repo/shared'
import { getDb } from '../db/client'
import { ratings, users } from '../db/schema'
import { eq, count } from 'drizzle-orm'
import type { AppEnv } from '../types'
import { ensureUserExists } from './user.Service'

export const submitVote = async (
  env: AppEnv['Bindings'],
  userId: string,
  vote: VoteRequest
) => {
  const { stallId, rating } = vote
  const ormDb = getDb(env.DB)

  try {
    // 1. Ensure whether the user exists 
    await ensureUserExists(env, userId)

    // 2. Now proceed with the vote
    await ormDb.insert(ratings).values({ userId, stallId, rating })
  } catch (e: any) {
    if (e.message && e.message.includes('UNIQUE constraint failed')) {
      throw new Error('Already voted')
    }
    console.error('Database insertion error:', e)
    throw new Error('Internal Server Error')
  }

  try {
    const countResult = await ormDb
      .select({ count: count() })
      .from(ratings)
      .where(eq(ratings.userId, userId))

    const progressCount = countResult[0]?.count || 1

    if (progressCount >= 15) {
      await ormDb
        .update(users)
        .set({ completed: true })
        .where(eq(users.id, userId))
    }

    return progressCount
  } catch (e: any) {
    console.error('Database query/update error:', e)
    throw new Error('Internal Server Error')
  }
}
