import { GoogleGenAI } from '@google/genai'
import { portfolioSystemInstruction } from '../../src/lib/chatbot/systemPrompt'

const apiKey = process.env.GEMINI_API_KEY
const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash'
// Used automatically when the primary model is overloaded (503/429).
// Set GEMINI_FALLBACK_MODEL in your env to change it.
const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.8-flash'

const maxMessages = 20
const maxMessageLength = 1000 // user messages
const maxAssistantLength = 8000 // the bot's own earlier replies are longer
const historyWindow = 8 // only send the most recent messages to Gemini

// Each model is tried up to this many times before moving to the next one
const attemptsPerModel = 2
const retryDelayMs = 500

type IncomingMessage = {
  role: 'user' | 'assistant'
  content: string
}

// Created once, reused across warm invocations
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

const json = (status: number, body: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Temporary Google-side problems: overloaded, rate limited, or server hiccups
const isRetryable = (error: unknown) => {
  const status = (error as { status?: number })?.status
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504
}

type Contents = { role: 'user' | 'model'; parts: { text: string }[] }[]

/**
 * Starts a streaming request. On temporary errors it retries, then falls
 * back to the backup model. Errors that happen when the stream starts are
 * thrown here, so we can recover before sending anything to the browser.
 */
async function startStream(client: GoogleGenAI, contents: Contents) {
  const models = [primaryModel]
  if (fallbackModel && fallbackModel !== primaryModel) models.push(fallbackModel)

  let lastError: unknown

  for (const model of models) {
    for (let attempt = 1; attempt <= attemptsPerModel; attempt++) {
      try {
        return await client.models.generateContentStream({
          model,
          contents,
          config: {
            systemInstruction: portfolioSystemInstruction,
            // Thinking tokens count toward this limit, so keep it generous
            maxOutputTokens: 2048,
          },
        })
      } catch (error) {
        lastError = error
        console.error(`Gemini request failed (${model}, attempt ${attempt}):`, error)

        // Bad request, auth problems, etc. won't be fixed by retrying
        if (!isRetryable(error)) throw error

        if (attempt < attemptsPerModel) await sleep(retryDelayMs * attempt)
      }
    }
  }

  throw lastError
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed.' })
  }

  if (!ai) {
    return json(503, { error: 'The chat service is not configured yet.' })
  }

  let messages: IncomingMessage[]

  try {
    const body = (await req.json()) as { messages?: IncomingMessage[] }

    if (
      !Array.isArray(body.messages) ||
      body.messages.length === 0 ||
      body.messages.length > maxMessages
    ) {
      return json(400, { error: 'Please provide a valid conversation.' })
    }

    messages = body.messages

    if (
      messages.some(
        (message) =>
          !message ||
          !['user', 'assistant'].includes(message.role) ||
          typeof message.content !== 'string' ||
          message.content.trim().length === 0 ||
          message.content.length >
            (message.role === 'user' ? maxMessageLength : maxAssistantLength)
      )
    ) {
      return json(400, {
        error: 'Messages must be between 1 and 1,000 characters.',
      })
    }
  } catch {
    return json(400, { error: 'Please provide valid JSON.' })
  }

  try {
    const stream = await startStream(
      ai,
      messages.slice(-historyWindow).map((message) => ({
        role: message.role === 'assistant' ? ('model' as const) : ('user' as const),
        parts: [{ text: message.content.trim() }],
      }))
    )

    const encoder = new TextEncoder()

    const body = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.text) controller.enqueue(encoder.encode(chunk.text))
          }
          controller.close()
        } catch (error) {
          console.error('Gemini stream failed:', error)
          // Surface the failure so the UI shows an error + retry instead of a half reply
          controller.error(error)
        }
      },
    })

    return new Response(body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('Gemini request failed after retries:', error)

    if (isRetryable(error)) {
      return json(503, {
        error: 'The assistant is very busy right now. Please try again in a moment.',
      })
    }

    return json(502, {
      error: 'The assistant is temporarily unavailable. Please try again.',
    })
  }
}