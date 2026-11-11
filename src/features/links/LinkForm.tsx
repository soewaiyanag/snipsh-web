import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { HTTP_STATUS, isApiError } from '@/api/client'
import type { createLinkFormSchema, updateLinkSchema } from '@/api/schemas'
import { Field } from '@/components/Field'
import { Button } from '@/components/ui/button'
import { SHORT_LINK_PREFIX } from '@/lib/short-link'

export const SLUG_TAKEN_MESSAGE = 'That slug is taken'

type LinkFormValues = { url: string; slug: string }

type LinkFormProps = {
  schema: typeof createLinkFormSchema | typeof updateLinkSchema
  defaultValues: LinkFormValues
  submitLabel: string
  submittingLabel: string
  slugLabel: string
  slugPlaceholder?: string
  onSubmit: (values: LinkFormValues) => Promise<void>
  onCancel?: () => void
}

// One form for making and editing a link: the same two fields and the same error rules.
export function LinkForm({
  schema,
  defaultValues,
  submitLabel,
  submittingLabel,
  slugLabel,
  slugPlaceholder,
  onSubmit,
  onCancel,
}: LinkFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values)
      reset(onCancel ? values : defaultValues)
      if (!onCancel) setFocus('url')
    } catch (error) {
      if (isApiError(error, HTTP_STATUS.conflict)) {
        setError('slug', { message: SLUG_TAKEN_MESSAGE }, { shouldFocus: true })
        return
      }
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setError('root', { message })
    }
  })

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      {errors.root && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          {errors.root.message}
        </p>
      )}
      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)_auto]">
        <Field
          label="Long URL"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="https://example.com/a/very/long/address"
          inputClassName="link-text"
          error={errors.url?.message}
          {...register('url')}
        />
        <Field
          label={slugLabel}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          prefix={SHORT_LINK_PREFIX}
          placeholder={slugPlaceholder}
          inputClassName="link-text"
          error={errors.slug?.message}
          {...register('slug')}
        />
        {/* The top margin lines the buttons up with the inputs, under the labels. */}
        <div className="flex gap-2 md:mt-[1.375rem]">
          <Button type="submit" disabled={isSubmitting} className="flex-1 md:flex-none">
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
