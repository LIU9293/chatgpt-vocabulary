import { makeCompletion, makeCompletionStream } from '../src/openai'
import { askCustomerServiceMessages } from '../src/messages'
export const config = { runtime: 'edge' }

export default async function handler (req) {
  const { searchParams } = new URL(req.url)
  const question = searchParams.get('question') 
  const stream = searchParams.get('stream') 
  if (!question) return new Response('Missing question', { status: 400 })
  const isStream = stream === 'true' || stream === '1'

  const messages = await askCustomerServiceMessages(question)

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