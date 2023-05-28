import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const makeCompletion = async (messages) => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
    })
    
    const response = JSON.parse(completion.data.choices[0].message.content)
  
    return response  
  } catch (error) {
    console.log(error)
    return { error: error.message }
  } 
}