import { Skeleton } from './Skeleton'

/**
 * Shared table shell — dense (audit-log style, e.g. Job History) or
 * comfortable (default). Wrap in <TableWrap> for the bordered glass
 * container and optional sticky header. See docs/UI_BLUEPRINT.md > Tables.
 */
export function TableWrap({ className = '', children, ...props }) {
  return (
    <div className={['table-wrap', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
}

export function Table({ density = 'comfortable', sticky = false, className = '', children, ...props }) {
  const cls = ['table', density, sticky ? 'sticky' : '', className].filter(Boolean).join(' ')
  return (
    <table className={cls} {...props}>
      {children}
    </table>
  )
}

/** A clickable row, e.g. a table row that navigates to a detail page. */
export function TableRow({ interactive = false, selected = false, className = '', children, ...props }) {
  const cls = [interactive ? 'table-row-interactive' : '', selected ? 'table-row-selected' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <tr className={cls} {...props}>
      {children}
    </tr>
  )
}

/**
 * Shape-preserving loading rows — renders `rows` skeleton rows with
 * `columns` cells each, so the table layout never jumps once real data
 * arrives.
 */
export function TableSkeletonRows({ rows = 3, columns = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="table-row-loading">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c}>
              <Skeleton height={14} width={c === 0 ? '60%' : '80%'} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
