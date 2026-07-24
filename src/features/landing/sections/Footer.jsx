import { Link } from 'react-router-dom'
import { IconArrowUpRight } from '../../../ui/icons'
import { FOOTER_LINKS, BRAND_NOTICE, REPO_URL } from '../landing.data'

function FooterLink({ href, label, external }) {
  if (external) {
    return <a href={href} target="_blank" rel="noreferrer">{label}</a>
  }
  return <Link to={href}>{label}</Link>
}

export function Footer() {
  return (
    <footer className="landing-footer-v2">
      <div className="landing-shell-wide landing-footer-v2-row">
        <Link to="/dashboard" className="btn btn-primary btn-lg landing-btn-layered">
          Launch App
        </Link>

        <div className="landing-footer-v2-links">
          <IconArrowUpRight width={18} height={18} className="landing-footer-v2-arrow" />
          <div className="landing-footer-v2-col">
            <span className="landing-footer-v2-heading">Platform</span>
            {FOOTER_LINKS.platform.map((l) => (
              <FooterLink key={l.label} {...l} />
            ))}
          </div>
          <div className="landing-footer-v2-col">
            <span className="landing-footer-v2-heading">Community</span>
            {FOOTER_LINKS.community.map((l) => (
              <FooterLink key={l.label} {...l} />
            ))}
          </div>
        </div>
      </div>

      <div className="landing-shell-wide landing-footer-v2-legal">
        <p className="landing-footer-v2-notice">
          {BRAND_NOTICE}{' '}
          <a href={`${REPO_URL}#-brand-notice`} target="_blank" rel="noreferrer">
            Read the full Brand Notice
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
