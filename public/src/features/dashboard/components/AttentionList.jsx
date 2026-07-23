import { useNavigate } from 'react-router-dom'
import { Card } from '../../../ui/Card'
import { Button } from '../../../ui/Button'
import { IconCheck } from '../../../ui/icons'

export function AttentionList({ items, onSwitchNetwork, onRefreshJobs }) {
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <Card className="mc-attention-empty">
        <span className="mc-attention-empty-icon">
          <IconCheck width={16} height={16} />
        </span>
        <div>
          <div className="mc-attention-empty-title">You&apos;re all caught up</div>
          <div className="mc-attention-empty-desc">Nothing needs your attention right now.</div>
        </div>
      </Card>
    )
  }

  const handleAction = (item) => {
    if (item.cta.to) {
      navigate(item.cta.to)
      return
    }
    if (item.cta.action === 'switchNetwork') onSwitchNetwork?.()
    if (item.cta.action === 'refreshJobs') onRefreshJobs?.()
  }

  return (
    <div className="mc-attention-list">
      {items.map((item) => (
        <Card key={item.id} className="mc-attention-item" data-tone={item.tone}>
          <div className="mc-attention-item-bar" data-tone={item.tone} />
          <div className="mc-attention-item-body">
            <div className="mc-attention-item-title">{item.title}</div>
            <div className="mc-attention-item-desc">{item.description}</div>
          </div>
          <Button variant={item.tone === 'attention' ? 'primary' : 'secondary'} size="sm" onClick={() => handleAction(item)}>
            {item.cta.label}
          </Button>
        </Card>
      ))}
    </div>
  )
}
