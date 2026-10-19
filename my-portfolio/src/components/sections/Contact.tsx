import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { siteConfig } from '../../constants/site'


const FORM_ENDPOINT = 'https://formsubmit.co/ajax/leankurtescano@gmail.com'

const LIMITS = {
  subjectMin: 3,
  subjectMax: 100,
  messageMin: 10,
  messageMax: 1000,
  emailMax: 254,
  messageMinWords: 1,
}

/**
 * Strict email check:
 * - local part starts/ends with a letter or digit (no leading/trailing dot or symbol)
 * - domain has at least one dot, labels can't start/end with a hyphen
 * - the last part (TLD) is letters only, 2+ characters
 */
const EMAIL_RE =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/

type Values = { email: string; subject: string; message: string }
type Errors = Partial<Record<keyof Values, string>>
type Status = 'idle' | 'sending' | 'success' | 'error'

const EMPTY: Values = { email: '', subject: '', message: '' }
const NOT_TOUCHED = { email: false, subject: false, message: false }

function emailProblem(email: string): string | undefined {
  if (!email) return 'Enter your email.'
  if (/\s/.test(email)) return 'Email cannot contain spaces.'
  if (email.length > LIMITS.emailMax) return 'That email is too long.'
  if (email.includes('..')) return 'Email cannot contain two dots in a row.'
  const [local = ''] = email.split('@')
  if (local.length > 64) return 'The part before @ is too long.'
  if (!EMAIL_RE.test(email)) return 'Enter a valid email address, like name@example.com.'
  return undefined
}

/**
 * Rejects text that is obviously not a real message:
 * only symbols/numbers, "aaaaaaa", "asdfasdfasdf", keyboard mashing, giant unbroken words.
 */
function textProblem(raw: string, label: 'Subject' | 'Message', minWords: number): string | undefined {
  const text = raw.trim()
  const lettersOnly = text.match(/\p{L}/gu) ?? []
  const words = text.split(/\s+/).filter(Boolean)

  // Needs real letters, not just numbers or symbols
  if (lettersOnly.length < (label === 'Message' ? 5 : 2)) {
    return `${label} needs real words, not just numbers or symbols.`
  }

  if (words.length < minWords) {
    return `${label} needs at least ${minWords} words.`
  }

  // Same letter or digit 6+ times in a row: "aaaaaa", "111111" ("Soooo" is fine)
  if (/([\p{L}\p{N}])\1{5,}/iu.test(text)) {
    return `${label} has too many repeated characters in a row.`
  }

  // Same symbol 8+ times in a row: "!!!!!!!!"
  if (/([^\s\p{L}\p{N}])\1{7,}/u.test(text)) {
    return `${label} has too many repeated symbols.`
  }

  // 3-4 character pattern repeated 4+ times: "asdfasdfasdfasdf" ("hahaha" is fine)
  if (/([\p{L}\p{N}]{3,4})\1{3,}/iu.test(text)) {
    return `${label} looks like repeated text. Please write a real ${label.toLowerCase()}.`
  }

  // Very few different letters: "abababab"
  const uniqueLetters = new Set(lettersOnly.map((c) => c.toLowerCase())).size
  if (text.length >= LIMITS.messageMin && uniqueLetters < 3) {
    return `${label} looks like random text. Please write a real ${label.toLowerCase()}.`
  }

  // Keyboard mashing: 7+ consonants in a row ("sdfghjkl")
  if (/[bcdfghjklmnpqrstvwxz]{7,}/i.test(text)) {
    return `${label} looks like random typing. Please write a real ${label.toLowerCase()}.`
  }

  // One giant word with no spaces (links are fine)
  if (words.some((w) => w.length > 40 && !/^https?:\/\//i.test(w))) {
    return `${label} has a word that is too long. Add spaces between words.`
  }

  return undefined
}

function validate({ email, subject, message }: Values): Errors {
  const errors: Errors = {}
  const e = email.trim()
  const s = subject.trim()
  const m = message.trim()

  const emailError = emailProblem(e)
  if (emailError) errors.email = emailError

  if (!s) errors.subject = 'Enter a subject.'
  else if (s.length < LIMITS.subjectMin) errors.subject = `Subject needs at least ${LIMITS.subjectMin} characters.`
  else if (s.length > LIMITS.subjectMax) errors.subject = `Subject can be at most ${LIMITS.subjectMax} characters.`
  else {
    const problem = textProblem(s, 'Subject', 1)
    if (problem) errors.subject = problem
  }

  if (!m) errors.message = 'Enter a message.'
  else if (m.length < LIMITS.messageMin) errors.message = `Message needs at least ${LIMITS.messageMin} characters.`
  else if (m.length > LIMITS.messageMax) errors.message = `Message can be at most ${LIMITS.messageMax} characters.`
  else {
    const problem = textProblem(m, 'Message', LIMITS.messageMinWords)
    if (problem) errors.message = problem
  }

  return errors
}

/** Collapses runs of spaces and blank lines so messages arrive clean. */
const cleanSingleLine = (value: string) => value.replace(/\s+/g, ' ').trim()
const cleanMultiLine = (value: string) =>
  value
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const fieldClass = (invalid: boolean) =>
  [
    'mt-2 w-full rounded-lg border bg-paper px-4 py-3 text-base text-ink placeholder:text-black/40',
    'outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink',
    invalid ? 'border-red-600' : 'border-black/20 hover:border-black/40',
  ].join(' ')

export default function Contact() {
  const { headline, text } = siteConfig.contact

  const [values, setValues] = useState<Values>(EMPTY)
  const [touched, setTouched] = useState<Record<keyof Values, boolean>>(NOT_TOUCHED)
  const [status, setStatus] = useState<Status>('idle')

  const errors = validate(values)
  const showError = (field: keyof Values) => (touched[field] ? errors[field] : undefined)

  const handleChange = (field: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (status === 'success' || status === 'error') setStatus('idle')
  }

  const handleBlur = (field: keyof Values) => () => setTouched((t) => ({ ...t, [field]: true }))

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched({ email: true, subject: true, message: true })
    if (Object.keys(errors).length > 0) return

    const form = e.currentTarget
    // Honeypot: real visitors never fill this hidden field, bots usually do.
    if ((form.elements.namedItem('_honey') as HTMLInputElement | null)?.value) return

    const email = values.email.trim().toLowerCase()
    const subject = cleanSingleLine(values.subject)
    const message = cleanMultiLine(values.message)

    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: subject, // becomes the subject line of the email you receive
          _captcha: 'false',
          _template: 'table',
          email, // FormSubmit uses this as the Reply-To address
          subject,
          message,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success === 'false' || data.success === false) throw new Error('Request failed')

      setStatus('success')
      setValues(EMPTY)
      setTouched(NOT_TOUCHED)
    } catch (err) {
      console.log('Contact form error:', err)
      setStatus('error')
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-h" className="bg-paper text-ink">
      <Reveal className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
        <h2 id="contact-h" className="max-w-4xl font-display text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-tight">{headline}</h2>
        <p className="mt-6 max-w-xl text-lg text-muted">{text}</p>

        <form onSubmit={handleSubmit} noValidate className="mt-10 max-w-xl" aria-describedby="contact-status">
          {/* Honeypot field (hidden from people and screen readers) */}
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

          <div>
            <label htmlFor="contact-email" className="text-sm font-semibold">Your email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={LIMITS.emailMax}
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="you@example.com"
              aria-invalid={!!showError('email')}
              aria-describedby={showError('email') ? 'contact-email-error' : undefined}
              className={fieldClass(!!showError('email'))}
            />
            {showError('email') && (
              <p id="contact-email-error" role="alert" className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="contact-subject" className="text-sm font-semibold">Subject</label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              value={values.subject}
              onChange={handleChange('subject')}
              onBlur={handleBlur('subject')}
              maxLength={LIMITS.subjectMax + 20}
              placeholder="What is this about?"
              aria-invalid={!!showError('subject')}
              aria-describedby={showError('subject') ? 'contact-subject-error' : undefined}
              className={fieldClass(!!showError('subject'))}
            />
            {showError('subject') && (
              <p id="contact-subject-error" role="alert" className="mt-2 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <label htmlFor="contact-message" className="text-sm font-semibold">Message</label>
              <span className={`text-xs ${values.message.length > LIMITS.messageMax ? 'text-red-600' : 'text-black/50'}`}>
                {values.message.length}/{LIMITS.messageMax}
              </span>
            </div>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              value={values.message}
              onChange={handleChange('message')}
              onBlur={handleBlur('message')}
              placeholder="Write your message here."
              aria-invalid={!!showError('message')}
              aria-describedby={showError('message') ? 'contact-message-error' : undefined}
              className={`${fieldClass(!!showError('message'))} resize-y`}
            />
            {showError('message') && (
              <p id="contact-message-error" role="alert" className="mt-2 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="submit" disabled={status === 'sending'} className="btn btn-solid disabled:cursor-not-allowed disabled:opacity-60">
              <Send size={16} aria-hidden /> {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            <p id="contact-status" role="status" aria-live="polite" className="text-sm">
              {status === 'success' && <span className="text-green-700">Message sent. Thank you!</span>}
              {status === 'error' && (
                <span className="text-red-600">Message not sent. Check your connection and try again.</span>
              )}
            </p>
          </div>
        </form>
      </Reveal>
    </section>
  )
}