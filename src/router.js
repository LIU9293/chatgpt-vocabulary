import express from 'express'
import { getOptionMessages } from './prompt.js'
import { makeCompletion } from './ai.js'
const router = express.Router()

router.use('/question/:word', async (req, res) => {
  const word = req.params.word
  const messages = getOptionMessages(word)
  const response = await makeCompletion(messages)
  res.send(response)
})

export default router

