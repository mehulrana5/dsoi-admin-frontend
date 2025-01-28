import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { Outlet } from "react-router-dom"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useContext } from "react"
import { UserContext } from "@/context/UserContextProvider"

export default function Page() {

  const context = useContext(UserContext)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="btn">Font Size</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => context?.setFontSize('sm')}>
                <div>Small</div>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => context?.setFontSize('base')}>
                <div>Medium</div>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => context?.setFontSize('lg')}>
                <div>Large</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div>
          <Outlet />
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
