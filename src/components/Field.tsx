import { useId } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type FieldProps = React.ComponentProps<typeof Input> & {
  label: string
  error?: string
  hint?: string
  prefix?: string
  inputClassName?: string
}

export function Field({
  label,
  error,
  hint,
  prefix,
  className,
  inputClassName,
  id,
  ...inputProps
}: FieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const messageId = `${fieldId}-message`
  const message = error ?? hint

  return (
    <div className={cn('grid content-start gap-1.5', className)}>
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="flex">
        {prefix && (
          <span className="link-text flex items-center whitespace-nowrap rounded-l-lg border border-r-0 border-input bg-muted px-2.5 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(prefix && 'rounded-l-none', inputClassName)}
          {...inputProps}
        />
      </div>
      {message && (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={cn('text-sm', error ? 'text-destructive' : 'text-muted-foreground')}
        >
          {message}
        </p>
      )}
    </div>
  )
}
