import { useState } from 'react'
import { Button } from '../../ui/Button'
import { Tooltip } from '../../ui/Tooltip'
import Breadcrumbs from './Breadcrumbs'
import { shortAddr } from '../../lib/format'
import { explorerAddressUrl } from '../../chains/arc'
import {
  IconMenu,
  IconSearch,
  IconExternal,
  IconWallet,
  IconSun,
  IconMoon,
  IconBell,
} from '../../ui/icons'

export default function Topbar({
  activeLabel,
  wallet,
  theme,
  onToggleTheme,
  onOpenMobileMenu,
  onOpenCommandPalette,
}) {
  const [copiedAddr, setCopiedAddr] = useState(false)

  const handleCopyAddress = async () => {
    if (!wallet.account) return
    await navigator.clipboard.writeText(wallet.account)
    setCopiedAddr(true)
    setTimeout(() => setCopiedAddr(false), 1500)
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="btn btn-ghost btn-icon mobile-menu-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
        >
          <IconMenu width={17} height={17} />
        </button>

        <div className="header-title-block">
          <div className="header-title-row">
            <h1>{activeLabel}</h1>
            <span className={`network-pill ${wallet.isArcNetwork ? 'live' : 'wrong'}`}>
              <span className="network-dot" aria-hidden="true" />
              {wallet.isArcNetwork ? 'Arc Testnet' : 'Wrong network'}
            </span>
          </div>
          <Breadcrumbs />
        </div>
      </div>

      <div className="header-right">
        <button
          type="button"
          className="topbar-search"
          onClick={onOpenCommandPalette}
          aria-label="Open command palette"
        >
          <IconSearch width={14} height={14} />
          <span className="topbar-search-label">Search</span>
          <span className="topbar-search-kbd">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </span>
        </button>

        <Tooltip label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
          <button className="icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <IconSun width={16} height={16} /> : <IconMoon width={16} height={16} />}
          </button>
        </Tooltip>

        <Tooltip label="Notifications">
          <button className="icon-btn" aria-label="Notifications" disabled>
            <span className="notif-dot" aria-hidden="true" />
            <IconBell width={16} height={16} />
          </button>
        </Tooltip>

        <div className="header-divider" aria-hidden="true" />

        {wallet.account ? (
          <div className="wallet-area">
            {!wallet.isArcNetwork && (
              <Button variant="warning" size="sm" onClick={wallet.switchToArc}>
                Switch to Arc
              </Button>
            )}
            <div className="wallet-chip">
              <span className="wallet-chip-dot" aria-hidden="true" />
              <button className="wallet-chip-addr mono" onClick={handleCopyAddress} aria-label="Copy wallet address">
                {copiedAddr ? '✓ Copied' : shortAddr(wallet.account)}
              </button>
              <a
                className="wallet-chip-explorer"
                href={explorerAddressUrl(wallet.account)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on explorer"
              >
                <IconExternal width={12} height={12} />
              </a>
            </div>
            <Button variant="danger" size="sm" onClick={wallet.disconnect}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button variant="primary" size="sm" onClick={wallet.connect} disabled={wallet.isConnecting}>
            <IconWallet width={14} height={14} style={{ marginRight: 6 }} />
            {wallet.isConnecting ? 'Connecting…' : 'Connect Wallet'}
          </Button>
        )}

        <button className="profile-avatar" aria-label="Profile" disabled>
          <span className="profile-avatar-glyph">
            {wallet.account ? wallet.account.slice(2, 4).toUpperCase() : '·'}
          </span>
        </button>
      </div>
    </header>
  )
}
