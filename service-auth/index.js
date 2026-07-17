import { createApp } from './configs/app.js'
import { dbConnection } from './configs/database.js'
import { config } from './configs/config.js'

// Importamos modelos
import './src/models/index.js'

const app = createApp()

const startServer = async () => {
  await dbConnection()

  const port = config.app?.port || process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`)
  })
}

startServer()