import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useWalletContext } from '../providers/WalletProvider'
import { useTheme } from '../providers/ThemeProvider'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { NAV_ITEMS } from '../nav'
import { Button } from '../../ui/Button'
import { ToastViewport } from '../../ui/ToastViewport'
import { Skeleton } from '../../ui/Skeleton'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import CommandPalette from './CommandPalette'

export default function AppLayout() {
  const wallet = useWalletContext()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [collapsed, setCollapsed] = useLocalStorage('arc_sidebar_collapsed', false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const activeItem = NAV_ITEMS.find((i) => location.pathname.startsWith(i.path))

  // Close mobile drawer on route change.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Global Cmd+K / Ctrl+K to open the command palette from anywhere in the shell.
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="app-root">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        agentId={wallet.agentId}
      />

      <div className="main-content">
        <Topbar
          activeLabel={activeItem?.label || 'Arc Agent Hub'}
          wallet={wallet}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenCommandPalette={() => setPaletteOpen(true)}
        />

        {wallet.error && (
          <div className="header-alert">
            <div className="alert alert-error">
              <span className="alert-icon">✕</span>
              <div className="alert-body">{wallet.error}</div>
            </div>
          </div>
        )}

        <div className="page-body">
          {wallet.account ? (
            <Suspense
              fallback={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Skeleton height={120} />
                  <Skeleton height={220} />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          ) : (
            <ConnectPrompt onConnect={wallet.connect} connecting={wallet.isConnecting} />
          )}
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ToastViewport />
    </div>
  )
}

function ConnectPrompt({ onConnect, connecting }) {
  return (
    <div className="card" style={{ maxWidth: 460, margin: '10vh auto 0', textAlign: 'center' }}>
      <div className="card-pad">
        <div className="panel-icon-wrap" style={{ margin: '0 auto 16px', fontSize: 18 }}>
          🔌
        </div>
        <h2 style={{ marginBottom: 8 }}>Connect your wallet</h2>
        <p className="panel-desc">
          Connect a wallet on Arc Testnet to register agents, submit reputation feedback, and transfer ANV.
        </p>
        <Button variant="primary" onClick={onConnect} disabled={connecting} className="btn-block">
          {connecting ? 'Connecting…' : 'Connect Wallet'}
        </Button>
      </div>
    </div>
  )
}
