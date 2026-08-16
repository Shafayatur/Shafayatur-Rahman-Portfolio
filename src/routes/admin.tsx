'use client'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Admin — Shafayatur Rahman' },
      // The CMS must never show up in search results.
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminLayout,
})

function AdminLayout() {
  return <Outlet />
}
