import { getQuestionCsvMessages } from '../src/prompt'
import { makeCompletion } from '../src/openai'

export const config = { runtime: 'edge' }

export default async function handler (req) {
  const { searchParams } = new URL(req.url)
  const word = searchParams.get('word')
  // const simple = searchParams.get('simple')
  // const isSimple = simple === 'true' || simple === '1'
 
  if (!word) return new Response('Missing word', { status: 400 })
  
  const messages = getQuestionCsvMessages(word)
  const completion = await makeCompletion(messages)
  const options = completion.split(',')
  
  const correctIndex = parseInt(options.at(-1))
  const response = {
    options: options.slice(0, 4).map((option, index) => ({
      option: option.trim(),
      correct: index === correctIndex,
    }))
  }

  return new Response(
    JSON.stringify(response),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }
  )
}