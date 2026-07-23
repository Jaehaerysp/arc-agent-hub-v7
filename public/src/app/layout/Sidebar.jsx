import { NavLink } from 'react-router-dom'
import { NAV_SECTIONS } from '../nav'
import { Tooltip } from '../../ui/Tooltip'
import { AppLogo } from '../../ui/AppLogo'
import { IconClose, IconCollapse } from '../../ui/icons'

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile, agentId }) {
  return (
    <>
      <div className={`sidebar-scrim ${mobileOpen ? 'open' : ''}`} onClick={onCloseMobile} />

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">
            <AppLogo size={34} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Arc Agent Hub</span>
            <span className="brand-sub">ERC-8004 · Testnet</span>
          </div>
          <button
            className="btn btn-ghost btn-icon mobile-menu-btn sidebar-close-btn"
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            <IconClose width={16} height={16} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {NAV_SECTIONS.map((section) => (
            <div className="nav-section" key={section.label}>
              <span className="nav-section-label">{section.label}</span>
              <div className="nav-section-items">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const badge = item.badgeKey === 'agentId' && agentId ? `#${agentId}` : null
                  const link = (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                      onClick={onCloseMobile}
                    >
                      <span className="nav-icon">
                        <Icon width={17} height={17} />
                      </span>
                      <span className="nav-label">{item.label}</span>
                      {badge && <span className="nav-badge">{badge}</span>}
                    </NavLink>
                  )
                  return collapsed ? (
                    <Tooltip label={item.label} key={item.path}>
                      {link}
                    </Tooltip>
                  ) : (
                    link
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="collapse-btn"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={collapsed}
          >
            <IconCollapse
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }}
              width={15}
              height={15}
            />
            {!collapsed && <span className="collapse-btn-label">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
