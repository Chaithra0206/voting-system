import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

type Bindings = {
  DB: D1Database
  CLERK_PUBLISHABLE_KEY: string
  CLERK_SECRET_KEY: string
}

type Variables = {
  userId: string
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

//using clerk middleware
app.use('*', clerkMiddleware())

//protected api group
const api = app.basePath('/api/v1')

api.use('/*', async (c, next) => {
  const auth = getAuth(c)
  
  if (!auth?.userId) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }
  
  //making userid available to the context
  c.set('userId', auth.userId)
  
  await next()
})

//test route
api.get('/health', (c) => {
  const userId = c.get('userId')
  
  return c.json({ 
    success: true, 
    data: { 
      message: 'Hello World', 
      userId 
    } 
  })
})

export default app
