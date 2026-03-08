import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  LayoutDashboard, FileText, Receipt, Users, CreditCard, Settings,
  LogOut, Menu, X, ChevronDown, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { title: t.nav.dashboard, url: "/dashboard", icon: LayoutDashboard },
    { title: t.nav.quotes, url: "/quotes", icon: FileText },
    { title: t.nav.invoices, url: "/invoices", icon: Receipt },
    { title: t.nav.customers, url: "/customers", icon: Users },
    { title: t.nav.billing, url: "/billing", icon: CreditCard },
    { title: t.nav.settings, url: "/settings", icon: Settings },
  ];

  const displayName = user?.user_metadata?.full_name || user?.email || "User";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 px-6">
          <div className="gradient-primary flex h-7 w-7 items-center justify-center rounded-lg">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <Link to="/dashboard" className="text-lg font-bold text-foreground">QuoteCraft</Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink key={item.url} to={item.url}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
              <item.icon className="h-4 w-4" />{item.title}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div className="mb-2 px-1">
            <LanguageSwitcher />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <div className="gradient-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-primary-foreground">
                  {initials}
                </div>
                <span className="flex-1 text-left font-medium text-foreground truncate">{displayName}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />{t.nav.settings}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />{t.nav.logOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="gradient-primary flex h-7 w-7 items-center justify-center rounded-lg">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <Link to="/dashboard" className="text-lg font-bold text-foreground">QuoteCraft</Link>
        </div>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-14 w-64 border-l border-border bg-card p-4 shadow-elevated h-[calc(100vh-3.5rem)]" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.url} to={item.url}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  onClick={() => setMobileMenuOpen(false)}>
                  <item.icon className="h-4 w-4" />{item.title}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 border-t border-border pt-4">
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                <LogOut className="h-4 w-4" />{t.nav.logOut}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="w-full pt-14 lg:pl-60 lg:pt-0">
        <div className="mx-auto max-w-6xl p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
