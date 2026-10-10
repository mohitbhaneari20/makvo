"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, MotionConfig, MotionGlobalConfig, motion } from "framer-motion";
import { Bell, Briefcase, Trophy, Compass, FolderKanban, Home, LayoutDashboard, MessageSquare, Network, Rss, Search, Sparkles, User, UsersRound, Video } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand";
import { NOTIFICATIONS } from "@/data/social";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Popover } from "@/components/ui/Dropdown";
import { Toasts } from "@/components/ui/Toasts";
import { SearchOverlay } from "./SearchOverlay";
import { Cursor } from "./Cursor";
import { MessageDock } from "./MessageDock";
import { ThemeSwitch, ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/lib/auth/context";
import { signOut } from "@/lib/auth/actions";
import { isAuthScreen } from "@/lib/auth/routes";
import { LogOut } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";

/** MAKVO logo. Midnight version on light grounds, reversed (Praxeti + Spring spark) on Midnight. */
export function Logo({ className = "", mark = false, markOnly = false, height = 22 }: { className?: string; mark?: boolean; markOnly?: boolean; height?: number }) {
  const kind = markOnly ? "mark" : "lockup";
  const w = markOnly ? height * (331 / 324) : height * (599 / 135);
  const img = (v: "midnight" | "reversed", cls: string) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/brand/makvo-${kind}-${v}.svg`} alt={BRAND.name} width={Math.round(w)} height={height} className={cls} style={{ height, width: "auto" }} />
  );
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center transition-opacity hover:opacity-80 ${className}`} aria-label={`${BRAND.name} home`} data-mark={mark || undefined}>
      <span className="logo-light">{img("midnight", "block")}</span>
      <span className="logo-dark">{img("reversed", "block")}</span>
    </Link>
  );
}

const NAV = [
  { label: "Discover", href: "/discover", match: ["/discover", "/work", "/feed"] },
  { label: "Projects", href: "/projects", match: ["/projects"], wide: true },
  { label: "People", href: "/people", match: ["/people", "/teams", "/network"] },
  { label: "Opportunities", href: "/opportunities", match: ["/opportunities", "/talent"] },
  { label: "Awards", href: "/awards", match: ["/awards"], wide: true },
  { label: "Messages", href: "/messages", match: ["/messages"], wide: true },
];

function TopNav() {
  const path = usePathname();
  const { setSearchOpen } = useApp();
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 hidden border-b border-line bg-paper/90 backdrop-blur-md md:block">
      <div className="container-x flex h-16 items-center justify-between">
        <div className="flex min-w-0 items-center gap-5 lg:gap-10">
          <Logo height={24} />
          <nav className="flex items-center gap-1" aria-label="Primary">
            {NAV.map((n) => {
              const active = n.match.some((m) => path === m || path.startsWith(m + "/"));
              return (
                <Link key={n.href} href={n.href} className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-body transition-colors lg:px-3 ${"wide" in n && n.wide ? "hidden xl:inline-block" : ""} ${active ? "text-ink" : "text-ink/75 hover:text-ink"}`}>
                  {n.label}
                  {n.label === "Messages" && <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-midnight">3</span>}
                  {active && <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-[17px] h-0.5 bg-hi" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-1 lg:gap-2">
          <button onClick={() => setSearchOpen(true)} aria-label="Search" className="hidden h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-sunk lg:inline-flex"><Search className="h-[18px] w-[18px]" /></button>
          <ThemeToggle />
          {user ? (<>
            <Notifs />
            <Button href="/dashboard" size="md" className="ml-1 lg:ml-2">Open {BRAND.name}</Button>
            <ProfileMenu />
          </>) : (<>
            <Link href="/login" className="whitespace-nowrap rounded-full px-3 py-2 text-body text-ink/80 transition hover:text-ink">Log in</Link>
            <Button href="/signup" size="md" className="ml-1">Join {BRAND.name}</Button>
          </>)}
        </div>
      </div>
    </header>
  );
}


function Notifs() {
  const { toast } = useApp();
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  return (
    <Popover align="right" width="w-[360px]" trigger={({ toggle }) => (
            <button onClick={toggle} aria-label="Notifications" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-sunk">
              <Bell className="h-[18px] w-[18px]" />{unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-hi ring-2 ring-paper" />}
            </button>
          )}>
            {(close) => (
              <div>
                <div className="flex items-center justify-between border-b border-line px-4 py-3"><span className="text-body font-medium">Notifications</span><button onClick={() => { toast("All caught up"); close(); }} className="text-small text-mute hover:text-ink">Mark all read</button></div>
                {NOTIFICATIONS.map((n) => (
                  <Link key={n.id} href={n.href} onClick={close} className="flex gap-3 px-4 py-3 transition hover:bg-sunk">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-hi" : "bg-transparent"}`} />
                    <span className="min-w-0 flex-1"><span className="block text-small font-medium">{n.text}</span><span className="block truncate text-small text-mute">{n.sub}</span></span>
                    <span className="text-[11px] text-faint">{n.when}</span>
                  </Link>
                ))}
              </div>
            )}
          </Popover>
  );
}

function ProfileMenu({ side }: { side?: boolean }) {
  const { role, setRole, toast } = useApp();
  const { user } = useAuth();
  const me = user
    ? { name: user.fullName || user.email || "Your account", tone: undefined, sub: user.email ?? "", src: user.avatarUrl }
    : role === "creator" ? { name: "Varun Sharma", tone: "#E9C8B0", sub: "Product & Brand Designer", src: null } : { name: "Amelia Brooks", tone: "#CFD8E6", sub: "Northwind Analytics", src: null };
  return (
    <Popover align={side ? "left" : "right"} up={side} width="w-72" trigger={({ toggle }) => (
            <button onClick={toggle} aria-label="Profile menu" className="flex shrink-0 rounded-full ring-offset-2 ring-offset-paper transition hover:ring-2 hover:ring-line"><Avatar name={me.name} tone={me.tone} src={me.src} size={34} status="online" /></button>
          )}>
            {(close) => (
              <div>
                <div className="flex items-center gap-3 border-b border-line p-4"><Avatar name={me.name} tone={me.tone} src={me.src} size={40} /><div className="min-w-0"><div className="truncate text-body font-medium">{me.name}</div><div className="truncate text-small text-mute">{me.sub}</div></div></div>
                <div className="p-1.5">
                  {user ? <MenuLink href="/profile" close={close}>Your profile</MenuLink> : role === "creator" && <MenuLink href="/people/varun-sharma" close={close}>Your profile</MenuLink>}
                  <MenuLink href="/dashboard" close={close}>Dashboard</MenuLink>
                  <MenuLink href="/network" close={close}>Your network</MenuLink>
                  <MenuLink href="/feed" close={close}>Work feed</MenuLink>
                  <MenuLink href="/talent" close={close}>Find talent</MenuLink>
                  <MenuLink href="/teams/studio-north" close={close}>Studio North</MenuLink>
                </div>
                <div className="border-t border-line p-3">
                  <div className="t-caption mb-2">Appearance</div>
                  <ThemeSwitch />
                </div>
                <div className="border-t border-line p-3">
                  <div className="t-caption mb-2">Preview dashboard as</div>
                  <div className="grid grid-cols-2 gap-1 rounded-full bg-sunk p-1">
                    {(["creator", "client"] as const).map((r) => (
                      <button key={r} onClick={() => { setRole(r); toast(`Switched to ${r} view`); close(); }} className={`rounded-full py-1.5 text-small font-medium capitalize transition ${role === r ? "bg-ink text-paper" : "text-mute"}`}>{r}</button>
                    ))}
                  </div>
                </div>
                {user && (
                  <form action={signOut} className="border-t border-line p-1.5">
                    <button type="submit" className="flex w-full items-center gap-2.5 rounded-xs px-3 py-2 text-left text-body text-ink transition hover:bg-sunk"><LogOut className="h-4 w-4 text-mute" />Sign out</button>
                  </form>
                )}
              </div>
            )}
          </Popover>
  );
}

function MenuLink({ href, children, close }: { href: string; children: React.ReactNode; close: () => void }) {
  return <Link href={href} onClick={close} className="block rounded-xs px-3 py-2 text-body transition hover:bg-sunk">{children}</Link>;
}


const SIDE = [
  { label: "Discover", href: "/discover", icon: Compass, match: ["/discover", "/work"] },
  { label: "Feed", href: "/feed", icon: Rss, match: ["/feed"] },
  { label: "Projects", href: "/projects", icon: FolderKanban, match: ["/projects"] },
  { label: "People", href: "/people", icon: UsersRound, match: ["/people", "/teams"] },
  { label: "Opportunities", href: "/opportunities", icon: Briefcase, match: ["/opportunities"] },
  { label: "Awards", href: "/awards", icon: Trophy, match: ["/awards"] },
  { label: "Messages", href: "/messages", icon: MessageSquare, match: ["/messages"], badge: 0 },
];
const SIDE2 = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, match: ["/dashboard"] },
  { label: "Your network", href: "/network", icon: Network, match: ["/network"] },
  { label: "Find talent", href: "/talent", icon: Sparkles, match: ["/talent"] },
  { label: "Interviews", href: "/interview", icon: Video, match: ["/interview"] },
];

function Sidebar() {
  const path = usePathname();
  const { role, convos } = useApp();
  const { user } = useAuth();
  const unread = convos.reduce((a, c) => a + c.unread, 0);
  const side = SIDE.map((i) => (i.href === "/messages" ? { ...i, badge: unread } : i));
  const side2 = user ? [{ label: "Your profile", href: "/profile", icon: User, match: ["/profile"] }, ...SIDE2] : SIDE2;
  const Item = ({ i }: { i: (typeof SIDE)[number] | (typeof SIDE2)[number] }) => {
    const on = i.match.some((m) => path === m || path.startsWith(m + "/"));
    return (
      <Link href={i.href} title={i.label} className={`relative flex items-center justify-center gap-3 rounded-full px-3 py-2 text-body transition-colors xl:justify-start ${on ? "bg-btn font-medium text-btn-fg" : "text-mute hover:bg-sunk hover:text-ink"}`}>
        <i.icon className="h-[18px] w-[18px]" strokeWidth={on ? 2 : 1.6} />
        <span className="hidden xl:inline">{i.label}</span>
        {"badge" in i && i.badge ? <span className="absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-midnight xl:static xl:ml-auto xl:h-5 xl:min-w-5 xl:px-1.5 xl:text-[11px]">{i.badge}</span> : null}
      </Link>
    );
  };
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col xl:w-60 border-r border-line bg-paper md:flex">
      <div className="flex h-16 items-center justify-center xl:justify-start xl:px-5"><span className="xl:hidden"><Logo markOnly height={26} /></span><span className="hidden xl:block"><Logo height={22} /></span></div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2" aria-label="Primary">
        <div className="space-y-0.5">{side.map((i) => <Item key={i.href} i={i} />)}</div>
        <div><div className="t-caption mb-2 hidden px-3 xl:block">Workspace</div><div className="mx-3 mb-2 hidden h-px bg-line md:block xl:hidden" /><div className="space-y-0.5">{side2.map((i) => <Item key={i.href} i={i} />)}</div></div>
        <div><div className="t-caption mb-2 hidden px-3 xl:block">Your team</div><div className="mx-3 mb-2 hidden h-px bg-line md:block xl:hidden" />
          <Link href="/teams/studio-north" title="Studio North" className="flex items-center justify-center gap-3 rounded-full px-3 py-2 text-body text-mute transition-colors hover:bg-sunk hover:text-ink xl:justify-start"><span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-forest text-[8px] font-semibold text-praxeti">SN</span><span className="hidden xl:inline">Studio North</span></Link>
          <Link href="/projects/finora-website" title="Finora Website" className="flex items-center justify-center gap-3 rounded-full px-3 py-2 text-body text-mute transition-colors hover:bg-sunk hover:text-ink xl:justify-start"><span className="h-[18px] w-[18px] rounded-full grad-spring" /><span className="hidden xl:inline">Finora Website</span></Link>
        </div>
      </nav>
      <div className="border-t border-line p-2 xl:p-3">
        <Link href="/" title="Back to home page" className="mb-1 flex items-center justify-center gap-3 rounded-full px-3 py-2 text-small text-mute transition-colors hover:bg-sunk hover:text-ink xl:justify-start"><Home className="h-4 w-4" /><span className="hidden xl:inline">Back to home page</span></Link>
        {user ? (
          <div className="flex items-center justify-center gap-2 rounded-sm px-1 py-1 xl:justify-start"><ProfileMenu side /><div className="hidden min-w-0 text-small leading-tight xl:block"><div className="truncate font-medium">{user.fullName || user.email}</div><div className="truncate text-mute capitalize">{user.accountType ?? `${role} view`}</div></div></div>
        ) : (
          <div className="flex flex-col gap-1.5 px-1 py-1">
            <Link href={`/login?next=${encodeURIComponent(path)}`} title="Sign in" className="flex h-9 items-center justify-center gap-2 rounded-full bg-btn text-small font-medium text-btn-fg transition hover:opacity-90"><User className="h-4 w-4 xl:hidden" /><span className="hidden xl:inline">Sign in</span></Link>
            <Link href="/signup" className="hidden h-9 items-center justify-center rounded-full border border-ink/20 text-small font-medium transition hover:border-ink xl:flex">Create account</Link>
          </div>
        )}
      </div>
    </aside>
  );
}

function AppTopbar() {
  const { setSearchOpen } = useApp();
  const { user } = useAuth();
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 hidden h-16 items-center justify-between gap-4 border-b border-line bg-paper/85 px-8 backdrop-blur-md md:flex">
      <button onClick={() => setSearchOpen(true)} className="flex h-9 w-full max-w-md items-center gap-2 rounded-full border border-line bg-surface px-4 text-small text-mute transition hover:border-ink">
        <Search className="h-4 w-4" /><span>Search people, projects, jobs…</span><kbd className="ml-auto rounded-xs border border-line px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd>
      </button>
      <div className="flex items-center gap-2">{user ? <><Button href="/talent" size="sm" variant="outline">Find talent</Button><ThemeToggle /><Notifs /></> : <><ThemeToggle /><Link href={`/login?next=${encodeURIComponent(path)}`} className="rounded-full px-3 py-1.5 text-small text-ink/80 transition hover:text-ink">Log in</Link><Button href="/signup" size="sm">Join {BRAND.name}</Button></>}</div>
    </header>
  );
}

function MobileTop() {
  const { setSearchOpen } = useApp();
  const { user } = useAuth();
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-5 backdrop-blur-md md:hidden">
      <Logo height={20} />
      <div className="flex items-center gap-1">
        <ThemeToggle className="!h-10 !w-10" />
        <button onClick={() => setSearchOpen(true)} aria-label="Search" className="inline-flex h-10 w-10 items-center justify-center rounded-full active:bg-sunk"><Search className="h-5 w-5" /></button>
        {user ? (
          <Link href="/notifications" aria-label="Notifications" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full active:bg-sunk"><Bell className="h-5 w-5" />{unread > 0 && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-hi" />}</Link>
        ) : (
          <Link href="/login" className="ml-1 inline-flex h-9 items-center rounded-full bg-btn px-4 text-small font-medium text-btn-fg">Log in</Link>
        )}
      </div>
    </header>
  );
}

const TABS = [
  { label: "Home", href: "/feed", icon: Home, match: ["/feed", "/"] },
  { label: "Discover", href: "/discover", icon: Compass, match: ["/discover", "/work", "/people", "/teams", "/opportunities", "/talent", "/network"] },
  { label: "Projects", href: "/projects", icon: FolderKanban, match: ["/projects", "/dashboard", "/interview"] },
  { label: "Messages", href: "/messages", icon: MessageSquare, match: ["/messages"] },
  { label: "Profile", href: "/people/varun-sharma", icon: User, match: ["/people/varun-sharma"] },
];

function BottomNav() {
  const path = usePathname();
  const { user } = useAuth();
  const { convos } = useApp();
  const unread = convos.some((c) => c.unread > 0);
  const tabs = TABS.map((t) => (t.label === "Profile" && user ? { ...t, href: "/profile", match: ["/profile"] } : t));
  const activeIdx = (() => {
    const exact = tabs.findIndex((t) => t.match.some((m) => m !== "/" && (path === m || path.startsWith(m + "/")) && t.label === "Profile"));
    if (exact >= 0) return exact;
    return tabs.findIndex((t) => t.match.some((m) => (m === "/" ? path === "/" : path === m || path.startsWith(m + "/"))));
  })();
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="grid grid-cols-5">
        {tabs.map((t, i) => {
          const Icon = t.icon; const on = i === activeIdx;
          return (
            <li key={t.label}>
              <Link href={t.href} className={`relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${on ? "text-ink" : "text-mute"}`}>
                <span className="relative flex h-8 w-14 items-center justify-center">
                  {on && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-spring" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                  <Icon className={`relative h-[21px] w-[21px] ${on ? "text-midnight" : ""}`} strokeWidth={on ? 2.2 : 1.7} />{t.label === "Messages" && unread && <span className="absolute right-3 top-0.5 h-2 w-2 rounded-full bg-forest ring-2 ring-paper" />}</span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mt-32 border-t border-line pb-28 md:pb-12">
      <div className="container-x grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5"><Logo height={28} /><p className="mt-4 max-w-xs text-small text-mute">A professional network for people who build digital things. Show your work. Get discovered.</p></div>
        {[["Explore", [["Discover", "/discover"], ["People", "/people"], ["Teams", "/teams/studio-north"], ["Opportunities", "/opportunities"], ["Awards", "/awards"]]], ["Hire", [["Find talent", "/talent"], ["Interview", "/interview"], ["Project workspace", "/projects/finora-website"]]], ["You", [["Dashboard", "/dashboard"], ["Your network", "/network"], ["Work feed", "/feed"]]]].map(([h, ls]) => (
          <div key={h as string} className="md:col-span-2"><div className="t-caption mb-4">{h as string}</div><ul className="space-y-2.5">{(ls as string[][]).map(([l, href]) => <li key={l}><Link href={href} className="text-small underline-link">{l}</Link></li>)}</ul></div>
        ))}
      </div>
      <div className="container-x flex flex-col justify-between gap-2 border-t border-line pt-6 text-small text-mute md:flex-row"><span>© 2026 {BRAND.name}. A working prototype, all names and projects are fictional.</span><span>Made by people who design and build.</span></div>
    </footer>
  );
}

// `?capture` in the URL finishes every animation instantly, for clean screenshots.
if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("capture")) MotionGlobalConfig.skipAnimations = true;

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const landing = path === "/";
  const { user } = useAuth();
  if (isAuthScreen(path)) return <MotionConfig reducedMotion="user">{children}<Toasts /></MotionConfig>;
  return (
    <MotionConfig reducedMotion="user">
      {landing ? (
        <div className="min-h-dvh">
          <TopNav /><MobileTop />
          <main id="main" className="min-h-[70dvh]">{children}</main>
          <Footer />
        </div>
      ) : (
        <>
          <Sidebar />
          <div className="md:pl-16 xl:pl-60">
            <AppTopbar /><MobileTop />
            <main id="main" className="min-h-[calc(100dvh-4rem)] pb-24 md:pb-16">{children}</main>
          </div>
        </>
      )}
      <BottomNav />
      <SearchOverlay /><Toasts /><Cursor />{user && <MessageDock />}
    </MotionConfig>
  );
}
