import express from 'express'
import router from './src/router.js'

const app = express()
const port = 3000

app.use('/', router)

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
