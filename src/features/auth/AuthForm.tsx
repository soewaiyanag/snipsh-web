import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { HTTP_STATUS, isApiError } from '@/api/client'
import type { Credentials, loginSchema, registerSchema } from '@/api/schemas'
import { Field } from '@/components/Field'
import { Button } from '@/components/ui/button'

type AuthFormProps = {
  title: string
  intro: string
  submitLabel: string
  submittingLabel: string
  schema: typeof loginSchema | typeof registerSchema
  passwordAutoComplete: 'current-password' | 'new-password'
  passwordHint?: string
  demo?: Credentials
  footer: ReactNode
  onSubmit: (credentials: Credentials) => Promise<void>
}

export function AuthForm({
  title,
  intro,
  submitLabel,
  submittingLabel,
  schema,
  passwordAutoComplete,
  passwordHint,
  demo,
  footer,
  onSubmit,
}: AuthFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Credentials>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const submit = handleSubmit(async (credentials) => {
    try {
      await onSubmit(credentials)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setError(isApiError(error, HTTP_STATUS.conflict) ? 'email' : 'root', { message })
    }
  })

  return (
    <div className="mx-auto w-full max-w-sm pt-6 sm:pt-16">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1.5 text-muted-foreground">{intro}</p>

      <form onSubmit={submit} noValidate className="sheet mt-6 grid gap-4 p-5">
        {errors.root && (
          <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
            {errors.root.message}
          </p>
        )}
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Field
          label="Password"
          type="password"
          autoComplete={passwordAutoComplete}
          hint={passwordHint}
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
        {demo && (
          <p className="border-t pt-4 text-sm text-muted-foreground">
            Just looking around?{' '}
            <button
              type="button"
              className="font-medium text-foreground underline hover:no-underline"
              onClick={() => reset(demo)}
            >
              Fill in the demo account
            </button>
          </p>
        )}
      </form>

      <p className="mt-4 text-sm text-muted-foreground">{footer}</p>
    </div>
  )
}
