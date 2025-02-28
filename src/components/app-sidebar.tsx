import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { UserContext } from "@/context/UserContextProvider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const context = React.useContext(UserContext)

  interface Option {
    title: string
    url: string
    isActive: boolean
    submenu?: Option[] // Optional submenu property for nested items
  }

  // Always add new option at the end of the list else indexing will change 
  const options: Option[] = useMemo(() => [
    { title: "Home", url: "/home", isActive: false },
    { title: "Admins", url: "/admins", isActive: false },
    { title: "Members", url: "/members", isActive: false },
    { title: "Families", url: "/families", isActive: false },
    { title: "Inventory", url: "/inventory", isActive: false },
    { title: "Orders", url: "/orders", isActive: false, },
    { title: "Logs", url: "/logs", isActive: false },
  ], [])

  const optionsByRole: { [key: string]: Option[] } = useMemo(() => ({
    "analyst": options,
    "superAdmin": options,
    "customerService": [options[0], options[1], options[2], options[3]],
    "bookKeeper": [options[0], options[5]],
    "barTender": [options[0], options[5]],
    "inventoryManager": [options[0], options[4]]
  }), [options])

  const location = useLocation();

  const [activeItem, setActiveItem] = useState<{ mainIdx: number; subIdx: number | null }>({ mainIdx: -1, subIdx: null });

  useEffect(() => {
    const activeMainIdx = options.findIndex(item => item.url === location.pathname);
    const activeSubIdx = options[activeMainIdx]?.submenu?.findIndex(subItem => subItem.url === location.pathname) || null;
    setActiveItem({ mainIdx: activeMainIdx, subIdx: activeSubIdx });
  }, [location.pathname, options]);

  const handleClick = (idx: number) => {
    setActiveItem({ mainIdx: idx, subIdx: null });
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <span>Select Theme <ModeToggle /></span>
      </SidebarHeader>
      <SidebarContent>
        {optionsByRole[localStorage.getItem("userType") || ""]?.map((item, mainIdx) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={`text-${context?.fontSize}`}
                    asChild
                    isActive={mainIdx === activeItem.mainIdx}
                  >
                    <Link to={item.url} onClick={() => handleClick(mainIdx)}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarContent>
          <SidebarMenuButton className={`text-${context?.fontSize}`} onClick={() => context?.logout()}>Logout</SidebarMenuButton>
        </SidebarContent>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
