import { makeCompletionStream } from '../src/openai'
import { getSuggestionMessage } from '../src/prompt'

export const config = { runtime: 'edge' }

export default async function handler (req) {
  const { searchParams } = new URL(req.url)
  const words = searchParams.get('words')

  if (!words) return new Response('Missing words', { status: 400 })
  
  const messages = getSuggestionMessage(words)
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