import { getQuestionMessages, getQuestionSimpleMessages } from '../src/prompt'
import { makeCompletion } from '../src/openai'

export const config = { runtime: 'edge' }

export default async function handler (req) {
  const { searchParams } = new URL(req.url)
  const word = searchParams.get('word')
  const simple = searchParams.get('simple')
  const isSimple = simple === 'true' || simple === '1'
 
  if (!word) return new Response('Missing word', { status: 400 })
  
  const messages = isSimple
    ? getQuestionSimpleMessages(word)
    : getQuestionMessages(word)

  const completion = await makeCompletion(messages, true)
  return new Response(
    JSON.stringify(completion),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }
  )
}