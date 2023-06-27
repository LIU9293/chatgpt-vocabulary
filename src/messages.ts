import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { createClient } from "@supabase/supabase-js"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"

export const getMessages = (question: string, context: string) => ([
  {
    "role": "system",
    "content": "你是一个AI助手，你需要根据用户的提问以及提供的背景信息来回答用户的问题，请用中文做出回应并尽可能提供有用的信息，如果你没有答案，请说我不知道，并让用户使用蘑菇自习室小程序中查看"
  },
  {
    "role": "assistant",
    "content": "背景信息: " + context
  },
  {
    "role": "user",
    "content": question
  }
])

export const askCustomerServiceMessages = async (question: string) => {
  const privateKey = process.env.SUPABASE_API_KEY || ''
  const supabaseUrl = 'https://pbwomhaljetjeocbllit.supabase.co'
  const client = createClient(supabaseUrl, privateKey, {
    auth: { persistSession: false }
  })

  const vectorStore = await SupabaseVectorStore.fromTexts(
    [],
    {},
    new OpenAIEmbeddings(),
    { client, tableName: "documents" }
  )

  const context = await vectorStore.similaritySearch(question, 1)
  const contextString = context[0].pageContent
  const messages = getMessages(question, contextString)
  return messages
}