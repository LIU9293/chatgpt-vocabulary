import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

type RawTextData = string[];

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw new Error("Please provide PINECONE_API_KEY");
}

export const embedData = async (
  pineconeIndexName: string,
  namespace: string,
  data: RawTextData,
): Promise<void> => {
  const client = new Pinecone({ apiKey });
  const pineconeIndex = client.Index(pineconeIndexName);
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const connectedString = data.join("\n\n");
  const docs = await splitter.createDocuments([connectedString]);

  await PineconeStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    { pineconeIndex, namespace },
  );
};

export const querySimiliarDocuments = async (
  pineconeIndexName: string,
  namespace: string,
  queryText: string,
) => {
  const client = new Pinecone({ apiKey });
  const pineconeIndex = client.Index(pineconeIndexName);

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex, namespace },
  );

  const results = await vectorStore.similaritySearch(queryText, 2);
  return results;
};

// delete all records in one namespace and re-embed
export const resetDataForNamespace = async (
  pineconeIndexName: string,
  namespace: string,
  data: RawTextData,
) => {
  const client = new Pinecone({ apiKey });
  await client.Index(pineconeIndexName).deleteAll();
  await embedData(pineconeIndexName, namespace, data);
};
