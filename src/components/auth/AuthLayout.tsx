"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { personById } from "@/data/people";
import { ProjectArt } from "@/components/art/ProjectArt";
import { Avatar } from "@/components/ui/Avatar";
import { Spark } from "@/components/ui/Badge";
import { Logo } from "@/components/shell/Shell";
import { ThemeToggle } from "@/components/shell/ThemeToggle";

const SHOWCASE = ["finora", "lumen", "noma", "arc", "orbit", "forma"].map((id) => PROJECTS.find((p) => p.id === id)!);

function WorkTile({ id, tall }: { id: string; tall?: boolean }) {
  const p = SHOWCASE.find((x) => x.id === id)!;
  const lead = personById(p.creators[0].id);
  return (
    <figure className="overflow-hidden rounded-md border border-praxeti/10 bg-[#0A2A4D]">
      <div className={tall ? "aspect-[4/5]" : "aspect-[4/3]"}><ProjectArt art={p.art} palette={p.palette} /></div>
      <figcaption className="flex items-center gap-2.5 px-3 py-2.5">
        <Avatar name={lead.name} size={24} />
        <span className="min-w-0 flex-1 truncate text-[12.5px] text-praxeti/85"><span className="font-medium text-praxeti">{p.name}</span> · {lead.name}</span>
        <Spark className="h-3 w-3 shrink-0" color="#DBE64C" />
      </figcaption>
    </figure>
  );
}

/** Brand side of the auth screens: Midnight ground, logo, message and real work from the platform. */
function BrandPanel() {
  return (
    <aside className="relative hidden h-dvh overflow-hidden bg-midnight text-praxeti lg:sticky lg:top-0 lg:flex lg:flex-col" aria-label="About MAKVO">
      <div className="relative z-10 px-12 pt-10 xl:px-16">
        <Link href="/" aria-label="MAKVO home" className="inline-block transition-opacity hover:opacity-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/makvo-lockup-reversed.svg" alt="MAKVO" width={142} height={32} style={{ height: 30, width: "auto" }} />
        </Link>
        <h1 className="mt-14 max-w-[13ch] text-[clamp(2.6rem,4.2vw,3.9rem)] font-medium leading-[1.02] tracking-[-0.04em] xl:mt-16">Good work deserves to be discovered.</h1>
        <p className="mt-5 max-w-[34ch] text-[1.05rem] leading-relaxed text-praxeti/70">Discover creative talent. Showcase your work. Build what&rsquo;s next.</p>
      </div>
      {/* Work wall: real projects and the people who made them */}
      <div className="relative mt-auto px-12 xl:px-16" aria-hidden="true">
        <div className="grid grid-cols-3 gap-3 [mask-image:linear-gradient(to_bottom,transparent,black_18%)]">
          <div className="space-y-3 pt-16"><WorkTile id="finora" /><WorkTile id="arc" tall /></div>
          <div className="space-y-3"><WorkTile id="lumen" tall /><WorkTile id="orbit" /></div>
          <div className="space-y-3 pt-10"><WorkTile id="noma" /><WorkTile id="forma" tall /></div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-midnight to-transparent" />
    </aside>
  );
}

export function AuthLayout({ children, back = { href: "/", label: "Back to MAKVO" } }: { children: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <BrandPanel />
      <div className="flex min-h-dvh flex-col">
        <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <span className="lg:hidden"><Logo height={22} /></span>
          <Link href={back.href} className="hidden items-center gap-1.5 text-small text-mute transition hover:text-ink lg:inline-flex"><ArrowLeft className="h-3.5 w-3.5" />{back.label}</Link>
          <ThemeToggle />
        </header>
        <main id="main" className="flex flex-1 items-start justify-center px-5 pb-10 pt-4 sm:items-center sm:px-8 sm:py-10 lg:px-12">
          <div className="w-full max-w-[400px]">{children}</div>
        </main>
        <footer className="px-5 pb-5 text-center text-[12px] text-mute sm:px-8 lg:px-12 lg:text-left">
          <Link href="/terms" className="underline-link">Terms</Link><span className="mx-2">·</span><Link href="/privacy" className="underline-link">Privacy</Link><span className="mx-2">·</span>© 2026 MAKVO
        </footer>
      </div>
    </div>
  );
}
