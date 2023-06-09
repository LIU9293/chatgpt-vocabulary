import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { makeCompletion, makeCompletionStream } from '../src/openai'
import { createClient } from "@supabase/supabase-js"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"

export const config = { runtime: 'edge' }

const getMessages = (question: string, context: string) => ([
  {
    "role": "system",
    "content": "你是一个AI助手，你需要根据用户的提问以及提供的背景信息来回答用户的问题，请用中文做出回应并尽可能提供有用的信息，如果你没有答案，请说我不知道，并让用户去蘑菇自习室小程序中查看"
  },
  {
    "role": "user",
    "content": `
    背景信息
      '''
      ${context}
      '''

    问题或咨询
      ${question}
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

  const context = await vectorStore.similaritySearch(question, 2)
  const contextString = context[0].pageContent + context[1].pageContent

  const messages = getMessages(question, contextString)

  if (isStream) {
    const res = await makeCompletionStream(messages)

    if (res.status === 401) {
      // to prevent browser prompt for credentials
      const newHeaders = new Headers(res.headers)
      newHeaders.delete("www-authenticate")

      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: newHeaders,
      })
    }
    
    return res
  }

  const completion = await makeCompletion(messages)
  return new Response(
    JSON.stringify(completion),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }
  )
}