import { makeCompletionStream } from '../src/openai'
import { getExplainMessages } from '../src/prompt'

export const config = { runtime: 'edge' }

export default async function handler (req) {
  const { searchParams } = new URL(req.url)
  const word = searchParams.get('word')
  if (!word) return new Response('Missing word', { status: 400 })
  
  const messages = getExplainMessages(word)
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