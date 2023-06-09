import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { makeCompletion, makeCompletionStream } from '../src/openai'
import { createClient } from "@supabase/supabase-js"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"

export const config = { runtime: 'edge' }

const getMessages = (question: string, context: string) => ([
  {
    "role": "system",
    "content": "You are a AI custmer helper, please answer the question based on providing information."
  },
  {
    "role": "user",
    "content": `Use following information as context to answer the question, answer in Simplified Chinese.
    
    User question is:
    ${question}

    Context is:
    ${context}
    `
  }
])

export default async function handler (req) {

  const privateKey = process.env.SUPABASE_API_KEY || ''
  const supabaseUrl = 'https://pbwomhaljetjeocbllit.supabase.co'
  const client = createClient(supabaseUrl, privateKey)

  const { searchParams } = new URL(req.url)
  const question = searchParams.get('question') 
  const stream = searchParams.get('stream') 
  if (!question) return new Response('Missing question', { status: 400 })
  const isStream = stream === 'true' || stream === '1'

  const vectorStore = await SupabaseVectorStore.fromTexts(
    [],
    {},
    new OpenAIEmbeddings(),
    { client, tableName: "documents" }
  )

  const context = await vectorStore.similaritySearch(question, 1)
  const contextString = context[0].pageContent
  const messages = getMessages(question, contextString)
  const completion = isStream
    ? await makeCompletionStream(messages)
    : await makeCompletion(messages)

  return new Response(
    JSON.stringify(completion),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }
  )
}