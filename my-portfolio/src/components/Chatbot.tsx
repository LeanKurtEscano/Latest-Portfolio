import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Bot, MessageCircle, RotateCcw, Send, X } from 'lucide-react'
import { sendChatMessage, type ChatMessage } from '../lib/chatbot/client'

const suggestedQuestions = [
  'Who is Lean Kurt Escano?',
  'What projects has Lean built?',
  'What technologies does Lean specialize in?',
  'What is Lean’s experience in AI and software development?',
  'How can I contact Lean?',
]

/** Styles for rendered markdown (no typography plugin needed). */
const markdownComponents: Components = {
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => <h3 className="mb-1.5 mt-3 text-base font-semibold first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-1.5 mt-3 text-base font-semibold first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="mb-1 mt-3 text-sm font-semibold first:mt-0">{children}</h4>,
  h4: ({ children }) => <h4 className="mb-1 mt-3 text-sm font-semibold first:mt-0">{children}</h4>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5 first:mt-0 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 first:mt-0 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium underline underline-offset-2 hover:opacity-80"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-line pl-3 text-muted">{children}</blockquote>
  ),
  hr: () => <hr className="my-3 border-line" />,
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg border border-line bg-paper p-3 text-xs leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const isBlock = /language-/.test(className ?? '') || String(children).includes('\n')
    if (isBlock) return <code className={className}>{children}</code>
    return (
      <code className="rounded border border-line bg-paper px-1 py-0.5 text-[0.85em]">{children}</code>
    )
  },
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-line bg-paper px-2 py-1 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-line px-2 py-1">{children}</td>,
}

/**
 * Reveals `content` one character at a time. It speeds up automatically if
 * the stream gets ahead of the animation, so it never lags far behind.
 * Pass animate=false for messages that should appear fully at once.
 */
function useTypewriter(content: string, animate: boolean) {
  const [shown, setShown] = useState(() => (animate ? 0 : content.length))
  const done = shown >= content.length

  useEffect(() => {
    if (done) return
    const id = setInterval(() => {
      setShown((current) => {
        const remaining = content.length - current
        if (remaining <= 0) return current
        return current + Math.max(1, Math.ceil(remaining / 25))
      })
    }, 16)
    return () => clearInterval(id)
  }, [content, done])

  return { text: content.slice(0, shown), shown }
}

function AssistantText({
  content,
  animate,
  onTick,
}: {
  content: string
  animate: boolean
  onTick: () => void
}) {
  const { text, shown } = useTypewriter(content, animate)
  // While typing, hide dangling markdown markers (e.g. a lone "**") until they're completed
  const visibleText =
    shown < content.length ? text.replace(/(\*{1,2}|_{1,2}|`{1,3}|#{1,6})\s*$/, '') : text

  useEffect(() => {
    onTick()
  }, [shown, onTick])

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {visibleText}
    </ReactMarkdown>
  )
}

function MessageBubble({
  message,
  animate,
  onTick,
}: {
  message: ChatMessage
  animate: boolean
  onTick: () => void
}) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'whitespace-pre-wrap rounded-br-md bg-ink text-paper'
            : 'min-w-0 break-words rounded-bl-md border border-line bg-surface text-ink'
        }`}
      >
        {isUser ? (
          message.content
        ) : (
          <AssistantText content={message.content} animate={animate} onTick={onTick} />
        )}
      </div>
    </div>
  )
}

/* ---------- Teaser bubble that points at the chat button ---------- */

// Edit these to change the behavior
const teaserMessages = ['Ask about Lean?']
const TEASER_FIRST_DELAY = 1500 // ms before the first bubble appears
const TEASER_TYPE_SPEED = 45 // ms per character while typing
const TEASER_HOLD = 4000 // ms the finished message stays visible
const TEASER_INTERVAL = 3000 // ms of silence before it shows again (lower = more frequent)

/**
 * Types a short message next to the chat button, keeps it on screen for a
 * moment, hides it, waits briefly, then repeats. The cursor only shows while
 * typing. Pauses while the chat is open.
 */
function FabTeaser({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion()
  const [text, setText] = useState('')
  const [visible, setVisible] = useState(false)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (!active) {
      setVisible(false)
      setTyping(false)
      setText('')
      return
    }

    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms))
      })

    const run = async () => {
      let index = 0
      await wait(TEASER_FIRST_DELAY)

      while (!cancelled) {
        const message = teaserMessages[index % teaserMessages.length]
        index += 1

        setText('')
        setVisible(true)

        if (reduceMotion) {
          setText(message)
        } else {
          setTyping(true)
          for (let char = 1; char <= message.length; char++) {
            if (cancelled) return
            setText(message.slice(0, char))
            await wait(TEASER_TYPE_SPEED)
          }
          setTyping(false)
        }

        await wait(TEASER_HOLD)
        if (cancelled) return

        setVisible(false)
        await wait(TEASER_INTERVAL)
      }
    }

    void run()

    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [active, reduceMotion])

  return (
    // Positioned to the left of the chat button, vertically centered on it
    <div className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative whitespace-nowrap rounded-xl border border-line bg-paper px-3.5 py-2 text-sm font-medium text-ink shadow-lg"
          >
            {text}
            {typing && (
              <span
                className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-ink align-middle"
                aria-hidden
              />
            )}
            {/* Little arrow pointing at the button */}
            <span
              className="absolute -right-1.5 top-1/2 size-3 -translate-y-1/2 rotate-45 border-r border-t border-line bg-paper"
              aria-hidden
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages.length, loading])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  // Called on every typed character so the view follows the text as it grows
  const scrollToEnd = useRef(() => {
    endRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' })
  }).current

  const submit = async (value = draft) => {
    const content = value.trim()
    if (!content || loading || content.length > 1000) return

    const nextMessages = [...messages, { role: 'user' as const, content }]
    setMessages(nextMessages)
    setDraft('')
    setError(null)
    setLastFailedMessage(null)
    setLoading(true)

    try {
      await sendChatMessage(nextMessages, (textSoFar) => {
        // Replace the in-progress assistant message as chunks arrive
        setMessages([...nextMessages, { role: 'assistant', content: textSoFar }])
      })
    } catch (caught) {
      // Drop any partial reply and show the error with a retry button
      setMessages(nextMessages)
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.')
      setLastFailedMessage(content)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submit()
  }

  // Show the typing dots only until the first chunk of the reply arrives
  const lastMessage = messages[messages.length - 1]
  const showTyping = loading && lastMessage?.role !== 'assistant'

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            id="portfolio-chat"
            aria-label="Chat with Lean's AI assistant"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 flex h-[min(680px,calc(100dvh-6rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-2xl sm:bottom-[4.5rem] sm:h-[min(620px,calc(100dvh-7rem))] sm:w-[380px]"
          >
            <header className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-ink text-paper" aria-hidden>
                  <Bot size={18} />
                </span>
                <div>
                  <h2 className="text-sm font-semibold">Lean's AI assistant</h2>
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <span className="size-1.5 rounded-full bg-green-500" aria-hidden />
                    Ready to help
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                <X size={18} aria-hidden />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.length === 0 && !loading && (
                <div className="flex h-full flex-col justify-center">
                  <div className="mb-5 text-center">
                    <p className="text-sm font-semibold">Ask me about Lean's work</p>
                    <p className="mt-1 text-xs text-muted">I can share details from this portfolio.</p>
                  </div>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => void submit(question)}
                        className="w-full rounded-lg border border-line px-3 py-2 text-left text-sm text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {messages.map((message, index) => (
                  <MessageBubble
                    key={`${message.role}-${index}`}
                    message={message}
                    // Only the reply currently being streamed gets the typing animation
                    animate={loading && index === messages.length - 1}
                    onTick={scrollToEnd}
                  />
                ))}
                {showTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3" aria-label="Assistant is typing">
                      {[0, 1, 2].map((dot) => (
                        <span key={dot} className="size-1.5 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${dot * 120}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-line bg-surface p-3 text-sm">
                  <p className="text-muted">{error}</p>
                  {lastFailedMessage && (
                    <button
                      type="button"
                      onClick={() => void submit(lastFailedMessage)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-ink underline underline-offset-4"
                    >
                      <RotateCcw size={13} aria-hidden /> Try again
                    </button>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-line p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <div className="flex items-end gap-2 rounded-lg border border-line bg-surface p-1.5 focus-within:border-ink">
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      event.currentTarget.form?.requestSubmit()
                    }
                  }}
                  maxLength={1000}
                  rows={1}
                  placeholder="Ask a question..."
                  aria-label="Message"
                  className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-ink outline-none placeholder:text-muted"
                  disabled={loading}
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={loading || !draft.trim()}
                  className="flex size-9 shrink-0 items-center justify-center rounded-md bg-ink text-paper transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={16} aria-hidden />
                </button>
              </div>
              <p className="mt-1.5 px-1 text-[11px] text-muted">Enter to send · Shift+Enter for a new line</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <FabTeaser active={!open} />

      <div className="relative">
        {/* Attention rings: two staggered pulses whenever the chat is closed */}
        {!open && !reduceMotion && (
          <>
            <span
              className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-ink/30"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-ink/20 [animation-delay:700ms]"
              aria-hidden
            />
          </>
        )}

        {/* Hops and wiggles every few seconds while the chat is closed */}
        <motion.div
          animate={
            !open && !reduceMotion
              ? { y: [0, -10, 0, -5, 0], rotate: [0, -10, 10, -5, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={
            !open && !reduceMotion
              ? { duration: 0.9, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.5 }
              : { duration: 0.2 }
          }
        >
          <motion.button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? 'Close chat' : 'Chat with my AI assistant'}
            aria-expanded={open}
            aria-controls="portfolio-chat"
            title="Chat with my AI assistant"
            initial={reduceMotion ? false : { scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.6 }}
            whileHover={reduceMotion ? undefined : { scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="relative flex size-12 items-center justify-center rounded-full border border-ink bg-ink text-paper shadow-lg sm:size-14"
          >
            {/* Icon swaps with a quick rotate + fade */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'open'}
                initial={reduceMotion ? false : { rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {open ? <X size={21} aria-hidden /> : <MessageCircle size={21} aria-hidden />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}