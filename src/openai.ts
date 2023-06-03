export interface OpenAIMessage {
  role: string
  content: string
}

export async function makeCompletion (
  messages: OpenAIMessage[],
  decodeJSON = false
) {
  const url = 'https://api.openai.com/v1/chat/completions'
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
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
  // try {
  //   const res = await fetch(fetchUrl, fetchOptions)

  //   if (res.status === 401) {
  //     // to prevent browser prompt for credentials
  //     const newHeaders = new Headers(res.headers)
  //     newHeaders.delete("www-authenticate")
  //     return new Response(res.body, {
  //       status: res.status,
  //       statusText: res.statusText,
  //       headers: newHeaders,
  //     })
  //   }

  //   return res
  // } finally {
  //   clearTimeout(timeoutId)
  // }
}