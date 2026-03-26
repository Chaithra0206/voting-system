import { Hono } from 'hono';
import { getDb } from '../db/client';
import { stalls, ratings, users } from '../db/schema';
import { eq, sum, count, gte, inArray } from 'drizzle-orm';
import type { AppEnv } from '../types';

const resultsRoutes = new Hono<AppEnv>();

resultsRoutes.get('/', async (c) => {
  try {
    const db = getDb(c.env.DB);
    const allStalls = await db.select().from(stalls);
    const validScores = await db
      .select({
        stallId: ratings.stallId,
        totalScore: sum(ratings.rating).mapWith(Number),
      })
      .from(ratings)
      .where(
        inArray(
          ratings.userId,
          db
            .select({ userId: ratings.userId })
            .from(ratings)
            .groupBy(ratings.userId)
            .having(gte(count(ratings.userId), 12))
        )
      )
      .groupBy(ratings.stallId);

    const scoreMap = new Map(validScores.map((s: { stallId: number | null, totalScore: number }) => [s.stallId, s.totalScore || 0]));

    const finalResults = allStalls.map((stall: typeof stalls.$inferSelect) => ({
      id: stall.id,
      name: stall.name,
      score: scoreMap.get(stall.id) || 0
    })).sort((a: { score: number }, b: { score: number }) => b.score - a.score);

    return c.json({
      success: true,
      data: finalResults
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return c.json({ success: false, error: 'Failed to fetch results' }, 500);
  }
});

export default resultsRoutes;
