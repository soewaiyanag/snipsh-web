import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { HTTP_STATUS, isApiError } from '@/api/client'
import { createLinkFormSchema } from '@/api/schemas'
import type { Link } from '@/api/types'
import { Field } from '@/components/Field'
import { Button } from '@/components/ui/button'
import { SHORT_LINK_PREFIX } from '@/lib/short-link'
import { SLUG_TAKEN_MESSAGE } from './LinkForm'
import { useCreateLink } from './queries'

const URL_ERROR_ID = 'create-url-error'

// The landing page's bar, doing the real thing. The slug stays out of the way until asked for.
export function CreateLinkBar({ onCreated }: { onCreated: (link: Link) => void }) {
  const createLink = useCreateLink()
  const [showsSlug, setShowsSlug] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(createLinkFormSchema), defaultValues: { url: '', slug: '' } })

  const submit = handleSubmit(async ({ url, slug }) => {
    try {
      const link = await createLink.mutateAsync({ url, slug: slug || undefined })
      reset()
      setShowsSlug(false)
      onCreated(link)
      setFocus('url')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      if (isApiError(error, HTTP_STATUS.conflict)) {
        setShowsSlug(true)
        // The API words "reserved" differently from "taken"; both belong under the slug field.
        setError('slug', { message: /reserved/i.test(message) ? message : SLUG_TAKEN_MESSAGE })
        return
      }
      // Custom slugs are a paid feature: that refusal belongs under the slug field too.
      if (isApiError(error, HTTP_STATUS.forbidden) && slug && /slug/i.test(message)) {
        setError('slug', { message })
        return
      }
      setError('root', { message })
    }
  })

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-[minmax(0,1fr)] justify-items-center gap-3">
      <div className="flex w-full items-center gap-2 rounded-full border border-input bg-card p-1.5 pl-5 transition-[border-color,box-shadow] duration-200 hover:border-foreground/55 focus-within:border-ring focus-within:shadow-field has-aria-invalid:border-destructive">
        <label htmlFor="create-url" className="sr-only">
          Long URL
        </label>
        <input
          id="create-url"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="Paste a long URL"
          aria-invalid={errors.url ? true : undefined}
          aria-describedby={errors.url ? URL_ERROR_ID : undefined}
          className="link-text h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:font-sans placeholder:text-muted-foreground"
          {...register('url')}
        />
        <Button type="submit" size="lg" disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? 'Shortening…' : 'Shorten'}
        </Button>
      </div>

      {errors.url && (
        <p id={URL_ERROR_ID} role="alert" className="text-sm text-destructive">
          {errors.url.message}
        </p>
      )}
      {errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      {showsSlug ? (
        <Field
          label="Slug (optional)"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          prefix={SHORT_LINK_PREFIX}
          placeholder="made for you if empty"
          inputClassName="link-text"
          className="mt-2 w-full max-w-sm text-left"
          error={errors.slug?.message}
          {...register('slug')}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowsSlug(true)}
          className="rounded-sm text-sm text-muted-foreground underline hover:text-foreground"
        >
          Choose your own slug
        </button>
      )}
    </form>
  )
}
