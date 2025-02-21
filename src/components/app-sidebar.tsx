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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
    {
      title: "Orders", url: "/orders/table", isActive: false,
      submenu: [
        { title: "Orders Table", url: "/orders/table", isActive: false },
        { title: "Create Order", url: "/orders/create", isActive: false },
        { title: "Scan Order", url: "/orders/scan", isActive: false },
      ],
    },
    { title: "Logs", url: "/logs", isActive: false },
  ], [])

  const optionsByRole: { [key: string]: Option[] } = useMemo(() => ({
    "analyst": options,
    "superAdmin": options,
    "customerService": [options[0], options[1], options[2], options[3]],
    "bookKeeper": [options[0], options[2], ...(options[4]?.submenu?.slice(0, 2) || [])],
    "barTender": [options[0], ...(options[4]?.submenu?.slice(2, 3) || [])]
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

  const handleSubClick = (mainIdx: number, subIdx: number) => {
    setActiveItem({ mainIdx, subIdx });
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
                  {item.submenu && (
                    <SidebarMenuSub>
                      {item.submenu.map((subItem, subIdx) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={subIdx === activeItem.subIdx}
                          >
                            <Link to={subItem.url} onClick={() => handleSubClick(mainIdx, subIdx)}>{subItem.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
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
