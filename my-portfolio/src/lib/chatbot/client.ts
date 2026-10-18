export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ErrorResponse {
  error?: string
}

/**
 * Sends the conversation to the chat function and streams the reply.
 * onToken is called with the full reply text so far each time a chunk arrives.
 * Resolves with the final reply.
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  onToken?: (textSoFar: string) => void
): Promise<string> {
  const response = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  // Validation / config / Gemini startup errors come back as JSON
  if (!response.ok) {
    let message = 'The assistant is temporarily unavailable.'
    try {
      const data = (await response.json()) as ErrorResponse
      if (data.error) message = data.error
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }

  if (!response.body) {
    throw new Error('The assistant returned an invalid response.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let text = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    text += decoder.decode(value, { stream: true })
    onToken?.(text)
  }

  text += decoder.decode()
  text = text.trim()

  if (!text) {
    throw new Error('The assistant returned an empty response.')
  }

  onToken?.(text)
  return text
}
