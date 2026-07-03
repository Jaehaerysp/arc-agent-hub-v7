/**
 * Base glass card. `variant` selects one of the reusable card types from
 * the Design Foundation (hero, metric, profile, job, developer, explorer)
 * without changing the shared elevation/radius language — see
 * docs/UI_BLUEPRINT.md > Cards. Omitting `variant` keeps prior behavior.
 */
export function Card({ interactive = false, variant, className = '', children, ...props }) {
  const cls = ['card', interactive ? 'interactive' : '', variant ? `card-${variant}` : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ className = '', children, ...props }) {
  return (
    <div className={['card-pad', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
}

export function PanelHeader({ icon, title, subtitle }) {
  return (
    <div className="panel-header">
      {icon && <div className="panel-icon-wrap">{icon}</div>}
      <div>
        <h2>{title}</h2>
        {subtitle && <p className="rep-panel-subtitle" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{subtitle}</p>}
      </div>
    </div>
  )
}
