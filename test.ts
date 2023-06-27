import 'dotenv/config'
import fetch from "node-fetch"
import { querySimiliarDocuments } from './src/embed/pinecone'
import { getMessages } from './src/messages'
import { makeCompletion } from './src/openai'

const main = async () => {
  const docs = await querySimiliarDocuments('mogroom', 'mogroom-user', '月卡多少钱')
  const contextString = docs[0].pageContent

  const newMessages = getMessages('月卡多少钱', contextString)
  console.log(JSON.stringify(newMessages, null, 2))

  const res = await makeCompletion(newMessages)
  console.log(res)
}

main()