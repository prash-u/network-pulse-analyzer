import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";
import { Network, LayoutGrid, Database, FlaskConical, BookOpen, Sparkles, Github } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { datasets } from "@/data/datasets";

const main = [
  { title: "Overview", url: "/", icon: LayoutGrid },
  { title: "Workspace", url: "/workspace", icon: Network },
  { title: "Datasets", url: "/datasets", icon: Database },
  { title: "Methods", url: "/methods", icon: FlaskConical },
  { title: "Docs", url: "/docs", icon: BookOpen },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const itemCls =
    "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth";
  const activeCls = "bg-sidebar-accent text-sidebar-primary";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary shadow-glow">
            <Network className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold text-sidebar-foreground">NetworkAnalyst</span>
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50">.ca</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={itemCls} activeClassName={activeCls}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Sample datasets</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {datasets.map((d) => (
                  <SidebarMenuItem key={d.id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`/workspace?dataset=${d.id}`}
                        className={itemCls}
                        activeClassName={activeCls}
                      >
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ background: `hsl(${d.color})`, boxShadow: `0 0 8px hsl(${d.color} / 0.6)` }}
                        />
                        <span className="truncate">{d.shortName} — {d.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {!collapsed ? (
          <div className="rounded-md bg-sidebar-accent/50 p-3 text-xs text-sidebar-foreground/70">
            <div className="mb-1 flex items-center gap-1.5 font-medium text-sidebar-primary">
              <Sparkles className="h-3 w-3" /> v2.0 preview
            </div>
            Faster layouts, mobile-first, install as PWA.
          </div>
        ) : (
          <Sparkles className="h-4 w-4 mx-auto text-sidebar-primary" />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
