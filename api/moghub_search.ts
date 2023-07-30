import { querySimiliarDocuments } from '../src/embed/pinecone'
import { makeCompletion } from '../src/openai'

export const config = { runtime: 'edge' }

export default async function handler (req) {
  const { searchParams } = new URL(req.url)
  const text = searchParams.get('text')
  const namespace = searchParams.get('namespace')

  if (!text) {
    throw new Error('Please provide text in querystring')
  }

  if (!namespace) {
    throw new Error('Please provide namespace in querystring')
  }
  

  const docs = namespace === 'wx9949952662bbb0c4'
    ? await querySimiliarDocuments('mogroom', 'mogroom-user', text)
    : await querySimiliarDocuments('mogroom', namespace, text)
  const content = docs[0].pageContent  

  return new Response(
    JSON.stringify({ content }),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }
  )
}