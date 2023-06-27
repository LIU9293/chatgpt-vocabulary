export interface OpenAIMessage {
  role: string
  content: string
}

export interface OpenAIFunction {
  name: string,
  description: string,
  parameters: {
    type: string,
    properties: any,
    required?: string[]
  }
}

export async function makeCompletion (
  messages: OpenAIMessage[],
  decodeJSON = false
) : Promise<string> {
  try {
    const url = 'https://api.openai.com/v1/chat/completions'
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-0613',
        messages,
      })
    }

    const response = await fetch(url, requestOptions)
    const json = await response.json()
    if (!decodeJSON) {
      return json.choices[0].message?.content
    }
    
    const content = JSON.parse(json.choices[0].message?.content || "{}")
    return content
  } catch (error) {
    console.error(error)
    return 'openai API错误，请稍后重试'
  }
}

export async function makeCompletionStream (
  messages: OpenAIMessage[]
) {

  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, 10 * 60 * 1000)
    
  const fetchUrl = 'https://api.openai.com/v1/chat/completions'
  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    cache: "no-store",
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      stream: true,
    }),
    signal: controller.signal,
  }

  return await fetch(fetchUrl, fetchOptions)
}

export type FunctionCallResponse = {
  functionCall: {
    name: string,
    arguments: any
  } | null,
  content: string | null,
  isFunction: boolean
}

export async function callGptFunction (
  messages: OpenAIMessage[],
  functions: OpenAIFunction[]
) : Promise<FunctionCallResponse> {
  const url = 'https://api.openai.com/v1/chat/completions'  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-0613',
      messages,
      functions
    })
  }

  const response = await fetch(url, requestOptions)
  const json = await response.json()

  if (!json.choices) {
    throw new Error(json?.error?.message || 'GPT response error')
  }

  if (json.choices[0]?.message?.content) {
    return {
      functionCall: null,
      content: json.choices[0]?.message?.content,
      isFunction: false,
    }
  } 

  if (json.choices[0]?.message?.function_call) {
    return { 
      functionCall: { 
        name: json.choices[0]?.message?.function_call.name,
        arguments: JSON.parse(json.choices[0]?.message?.function_call.arguments)
      },
      content: null,
      isFunction: true
    }
  }

  return { content: '我不知道你在说什么', functionCall: null, isFunction: false }
}