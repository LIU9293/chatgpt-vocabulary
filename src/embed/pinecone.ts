import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeClient } from "@pinecone-database/pinecone"
import { PineconeStore } from "langchain/vectorstores/pinecone"
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

type RawTextData = string[]

const apiKey = process.env.PINECONE_API_KEY
const environment = process.env.PINECONE_ENVIRONMENT
if (!apiKey || !environment) {
  throw new Error('Please provide PINECONE_API_KEY and PINECONE_ENVIRONMENT')
}

export const embedData = async (pineconeIndexName: string, namespace: string, data: RawTextData): Promise<void> => {
  const client = new PineconeClient();
  await client.init({ apiKey, environment })
  const pineconeIndex = client.Index(pineconeIndexName)
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  })

  const connectedString = data.join('\n\n')
  const docs = await splitter.createDocuments([connectedString])
  
  await PineconeStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    { pineconeIndex, namespace }
  )
}

export const querySimiliarDocuments = async (pineconeIndexName: string, namespace: string, queryText: string) => {
  const client = new PineconeClient();
  await client.init({ apiKey, environment })

  const pineconeIndex = client.Index(pineconeIndexName)

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex, namespace }
  )
  
  const results = await vectorStore.similaritySearch(queryText, 2)
  return results
}

// delete all records in one namespace and re-embed
export const resetDataForNamespace = async (pineconeIndexName: string, namespace: string, data: RawTextData) => {
  const client = new PineconeClient();
  await client.init({ apiKey, environment })
  await client.Index(pineconeIndexName).delete1({ deleteAll: true, namespace })
  await embedData(pineconeIndexName, namespace, data)
}