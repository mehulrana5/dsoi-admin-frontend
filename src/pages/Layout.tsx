import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { Outlet } from "react-router-dom"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "@/context/UserContextProvider"

export default function Page() {
  const context = useContext(UserContext)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  
  // Detect mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileView(isMobile);
      setIsSidebarOpen(!isMobile);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleTriggerClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    // Only close sidebar if in mobile view
    if (isSidebarOpen && isMobileView) {
      setIsSidebarOpen(false);
      triggerRef.current?.click();
    }
  };
  
  return (
    <SidebarProvider open={isSidebarOpen}>
      <AppSidebar 
        data-sidebar 
        closeSidebar={closeSidebar} 
        isMobileView={isMobileView}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger 
            ref={triggerRef}
            onClick={handleTriggerClick}
          />
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