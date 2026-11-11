import { DeleteLoop } from './CutMark'

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-1.5 text-lg font-extrabold tracking-tight">
      <DeleteLoop className="text-primary" />
      SnipShort
    </span>
  )
}
