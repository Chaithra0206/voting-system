import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { getProgress } from '../controllers/progress.Controller'

const progress = new Hono<AppEnv>()

progress.get('/:userId', getProgress)

export default progress
