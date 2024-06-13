import { querySimiliarDocuments } from "../src/embed/pinecone";

export const config = { runtime: "nodejs" };

export default async function handler(request, response) {
  // const { searchParams } = new URL(req.url);
  const { text, namespace } = request.query;

  // const text = searchParams.get("text");
  // const namespace = searchParams.get("namespace");

  if (!text) {
    throw new Error("Please provide text in querystring");
  }

  if (!namespace) {
    throw new Error("Please provide namespace in querystring");
  }

  const docs = await querySimiliarDocuments("moghub", namespace, text);
  const content = docs[0].pageContent;

  return response.json({ content });

  // return new Response(JSON.stringify({ content }), {
  //   status: 200,
  //   headers: { "content-type": "application/json" },
  // });
}
