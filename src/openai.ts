export async function makeCompletion (messages) {
  const url = 'https://api.openai.com/v1/chat/completions'
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      temperature: 1,
      messages,
    })
  }

  const response = await fetch(url, requestOptions)
  const json = await response.json()
  const content = JSON.parse(json.choices[0].message?.content || "{}")
  return content
}
