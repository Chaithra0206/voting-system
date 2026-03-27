import type { VoteRequest } from '@repo/shared'
import { getDb } from '../db/client'
import { ratings, users } from '../db/schema'
import { eq, count } from 'drizzle-orm'
import type { AppEnv } from '../types'
import { ensureUserExists } from './user.Service'
import { refreshStallAggregates } from './stalls.Service'
function isVotingOpen(): boolean {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(Date.now() + istOffset);

  const year = istTime.getUTCFullYear();
  const month = istTime.getUTCMonth() + 1;
  const day = istTime.getUTCDate();

  if (year !== 2026 || month !== 3) return false;

  const timeInMinutes = istTime.getUTCHours() * 60 + istTime.getUTCMinutes();
  const startMins = 9 * 60 + 30; // 9:30 AM (570)

  if (day === 28) {
    const endMins = 22 * 60; // 10:00 PM (1320)
    return timeInMinutes >= startMins && timeInMinutes <= endMins;
  }

  if (day === 29) {
    const endMins = 12 * 60; // 12:00 PM (720)
    return timeInMinutes >= startMins && timeInMinutes <= endMins;
  }

  return false;
}

export const submitVote = async (
  env: AppEnv['Bindings'],
  userId: string,
  vote: VoteRequest
) => {
  if (!isVotingOpen()) {
    throw new Error('Voting is currently closed');
  }

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

    if (progressCount >= 11) {
      await ormDb
        .update(users)
        .set({ completed: true })
        .where(eq(users.id, userId))
    }

    // Update stall aggregates immediately
    if (progressCount === 11) {
      // User just became qualified! All their stalls need refreshing
      const userRatings = await ormDb
        .select({ stallId: ratings.stallId })
        .from(ratings)
        .where(eq(ratings.userId, userId));

      const stallIds = userRatings
        .map(r => r.stallId)
        .filter((id): id is number => id !== null);

      await refreshStallAggregates(env.DB, stallIds);
    } else {
      // Normal vote (could be qualified or not, but only this stall is affected)
      await refreshStallAggregates(env.DB, [stallId]);
    }

    return progressCount
  } catch (e: any) {
    console.error('Database query/update error:', e)
    throw new Error('Internal Server Error')
  }
}
