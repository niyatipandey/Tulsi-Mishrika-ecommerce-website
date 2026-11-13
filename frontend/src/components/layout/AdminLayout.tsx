
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../pages/Admin/AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 min-w-0 p-5 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
