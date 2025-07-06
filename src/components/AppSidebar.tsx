import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";
import {
  FilePlus,
  Home,
  ListCheck,
  LogOut,
  Logs,
  ScrollText,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";
const navItems = [
  {
    label: "Dashboard",
    icon: Home,
    url: "/recruiter/dashboard",
  },
  {
    label: "Tests",
    icon: ListCheck,
    url: "/recruiter/tests",
  },
  {
    label: "Create Test",
    icon: FilePlus,
    url: "/recruiter/test/create",
  },
  {
    label: "Candidates",
    icon: Users,
    url: "/recruiter/candidates",
  },
  {
    label: "Logs",
    icon: ScrollText,
    url: "/recruiter/logs",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-primary">Skill Sync</h1>
          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link to={item.url} className="flex items-center gap-2">
                <SidebarMenuButton className="cursor-pointer">
                  <item.icon size={16} /> {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-14 flex gap-2 items-center hover:bg-muted p-2 rounded-md">
            <Avatar className="">
              <AvatarImage src="https://github.com/shadcn.png"></AvatarImage>
              <AvatarFallback>VK</AvatarFallback>
            </Avatar>
            <div className="">
              <p className="text-sm text-left">Vedant Kotkar</p>
              <p className="text-sm">vedantkotkar111@gmail.com</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem className="w-full">
              <Button variant={"destructive"} className="w-full">
                <LogOut />
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
