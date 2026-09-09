import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import MobileSidebar from './MobileSidebar'
import { PageTitleProvider, usePageTitleContext } from '../../context/PageTitleContext'

function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { title } = usePageTitleContext()

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <Sidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AppLayout() {
  return (
    <PageTitleProvider>
      <Shell />
    </PageTitleProvider>
  )
}
