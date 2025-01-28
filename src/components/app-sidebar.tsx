import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { UserContext } from "@/context/UserContextProvider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const context = React.useContext(UserContext)

  // Always add new option at the end of the list else indexing will change 
  const options = [
    {
      title: "Home",
      url: "/home",
      isActive: false
    },
    {
      title: "Admins",
      url: "/admins",
      isActive: false
    },
    {
      title: "Members",
      url: "/members",
      isActive: false
    },
    {
      title: "Families",
      url: "/families",
      isActive: false
    },
    {
      title: "Orders",
      url: "/orders",
      isActive: false
    },
    {
      title: "Logs",
      url: "/logs",
      isActive: false
    },
  ]

  const optionsByRole: { [key: string]: { title: string; url: string; isActive: boolean }[] } = {
    "analyst": options,
    "superAdmin": options,
    "customerService": [options[0], options[1], options[2], options[3]],
    "bookKeeper": [options[0], options[2], options[4]],
    "barTender": [options[0]]
  }

  const location = useLocation();

  const [data, setData] = useState({
    navMain: [
      {
        title: "Operations",
        url: "/",
        items: optionsByRole[localStorage.getItem("userType") || ""] || [],
      }
    ],
  });

  React.useEffect(() => {
    setData(prevData => {
      const newData = { ...prevData };
      newData.navMain[0].items.forEach(e => {
        e.isActive = e.url === location.pathname;
      });
      return newData;
    });
  }, [location.pathname]);

  function handleClick(idx: number) {
    setData(prevData => {
      const newData = { ...prevData };
      newData.navMain[0].items.forEach(e => {
        e.isActive = false;
      });
      newData.navMain[0].items[idx].isActive = true;
      return newData;
    });
  }
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <span>Select Theme <ModeToggle /></span>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item, idx) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link to={item.url} onClick={() => handleClick(idx)}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarContent>
          <SidebarMenuButton onClick={() => context?.logout()}>Logout</SidebarMenuButton>
        </SidebarContent>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
