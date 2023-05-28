import { makeCompletion } from '../src/openai'
import { getOptionMessages } from '../src/prompt'

export const config = { runtime: 'edge' }

export default async function handler (req) {
  const { searchParams } = new URL(req.url)
  const word = searchParams.get('word')

  if (!word) return new Response('Missing word', { status: 400 })
  
  const messages = getOptionMessages(word)
  const completion = await makeCompletion(messages)

  return new Response(
    JSON.stringify(completion),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }
  )
}