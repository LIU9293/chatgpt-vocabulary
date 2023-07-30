import { makeCompletionStream } from '../src/openai'

export const config = { runtime: 'edge' }

export default async function handler (req) {
  const json = await new Response(req.body).json();
  
  const messages = json.messages
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