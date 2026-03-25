import { getDb } from '../db/client'
import { ratings, users, stalls } from '../db/schema'
import { eq, count } from 'drizzle-orm'

export const fetchProgress = async (db: D1Database, userId: string) => {
  const ormDb = getDb(db)

  const userRecord = await ormDb.select({ completed: users.completed }).from(users).where(eq(users.id, userId))
  const isCompleted = userRecord[0]?.completed || false

  const countResult = await ormDb.select({ count: count() }).from(ratings).where(eq(ratings.userId, userId))
  const progressCount = countResult[0]?.count || 0

  const userRatings = await ormDb
    .select({
      stallId: stalls.id,
      stallName: stalls.name,
      rating: ratings.rating
    })
    .from(ratings)
    .innerJoin(stalls, eq(ratings.stallId, stalls.id))
    .where(eq(ratings.userId, userId))

  return { userId, progress: progressCount, isCompleted, ratings: userRatings }
}
