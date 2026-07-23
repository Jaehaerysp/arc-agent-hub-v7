import { Panel, Grid, GlassCard, Badge } from '../../../ui/design-system'
import { IconShield, IconCheck } from '../../../ui/icons'

/**
 * Certificates — six premium cards, each unlocked by a real, checkable
 * local condition from `computeCertificates` (agentId, feedback given,
 * validation requested, wallet connection). Locked cards stay visible
 * but dimmed, per the Blueprint's "show the path, not just the prize"
 * empty-state philosophy.
 */
export function CertificatesPanel({ certificates }) {
  return (
    <Panel title="Certificates" subtitle="On-chain proof, unlocked as it's earned" className="tv7-certificates-panel">
      <Grid minColWidth="220px" gap="md">
        {certificates.map((cert) => (
          <GlassCard key={cert.key} className={`tv7-cert-card ${cert.unlocked ? 'is-unlocked' : 'is-locked'}`} padding="md">
            <div className="tv7-cert-icon" aria-hidden="true">
              {cert.unlocked ? <IconCheck width={18} height={18} /> : <IconShield width={18} height={18} />}
            </div>
            <div className="tv7-cert-label">{cert.label}</div>
            <div className="tv7-cert-desc">{cert.desc}</div>
            <Badge variant={cert.unlocked ? 'success' : 'muted'} size="sm" dot={false}>
              {cert.unlocked ? 'Earned' : 'Locked'}
            </Badge>
          </GlassCard>
        ))}
      </Grid>
    </Panel>
  )
}
