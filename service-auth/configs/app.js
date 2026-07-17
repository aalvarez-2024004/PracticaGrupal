process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/users/user.routes.js'
import { corsOptions } from './cors-configuration.js'

export const createApp = () => {
  const app = express()

  app.use(express.json())
  app.use(cors(corsOptions))
  app.use(helmet())
  app.use(morgan('dev'))

  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)

  return app
}