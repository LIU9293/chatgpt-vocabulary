import 'dotenv/config'
import { createClient } from "@supabase/supabase-js"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { CharacterTextSplitter } from "langchain/text_splitter"
import { GitbookLoader } from "langchain/document_loaders/web/gitbook"
import { text1, text2, text3 } from './txt/text'

const privateKey = process.env.SUPABASE_API_KEY
const supabaseUrl = 'https://pbwomhaljetjeocbllit.supabase.co'
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const splitter = new CharacterTextSplitter({
  chunkSize: 600,
  chunkOverlap: 50
})

const embed = async () => {
  try {

    const client = createClient(supabaseUrl, privateKey)

    const gitbookLoader = new GitbookLoader("https://docs.mogroom.com", {
      shouldLoadAllPaths: true
    })
  
    const textDocs = await splitter.createDocuments([text1, text2, text3])
    const gitbookDocs = await gitbookLoader.loadAndSplit(splitter)
    const allDocs = [...gitbookDocs, ...textDocs]  
    
    // Load the docs into the vector store
    const vectorStore = await SupabaseVectorStore.fromDocuments(
      allDocs,
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { client }
    )
  } catch (error) {
    console.log(error)
  }
}

embed()