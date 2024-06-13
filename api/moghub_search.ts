import { querySimiliarDocuments } from "../src/embed/pinecone";

export default async function handler(request, response) {
  const { text, namespace } = request.query;

  if (!text) {
    throw new Error("Please provide text in querystring");
  }

  if (!namespace) {
    throw new Error("Please provide namespace in querystring");
  }

  const docs = await querySimiliarDocuments("moghub", namespace, text);
  const content = docs[0].pageContent;

  return response.json({ content });
}
