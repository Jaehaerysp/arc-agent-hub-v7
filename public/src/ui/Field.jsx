export function FieldGroup({ label, hint, error, badge, children }) {
  return (
    <div className="field-group">
      {label && (
        <label>
          {label}
          {badge}
        </label>
      )}
      {children}
      {error ? (
        <span className="field-hint is-error">{error}</span>
      ) : (
        hint && <span className="field-hint">{hint}</span>
      )}
    </div>
  )
}

export function Input({ error = false, className = '', ...props }) {
  return <input className={['input', error ? 'is-error' : '', className].filter(Boolean).join(' ')} {...props} />
}

export function Textarea({ error = false, className = '', ...props }) {
  return <textarea className={['textarea', error ? 'is-error' : '', className].filter(Boolean).join(' ')} {...props} />
}

export function Select({ error = false, className = '', children, ...props }) {
  return (
    <select className={['select', error ? 'is-error' : '', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </select>
  )
}

export function PrefixInput({ prefix, ...props }) {
  return (
    <div className="input-prefix-wrap">
      <span className="input-prefix">{prefix}</span>
      <input className="input" {...props} />
    </div>
  )
}
