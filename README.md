# MAKVO: prototype

A high-fidelity, fully clickable frontend prototype of a professional network where people are
discovered through the work they make. Discover → Connect → Hire → Build.

Product content runs on realistic mock data and in-memory state. Authentication is real (Supabase).

```bash
npm install
cp .env.example .env.local   # add your Supabase URL + anon key (see docs/AUTH.md)
npm run dev      # http://localhost:3000
npm run build    # production build
```

**Accounts:** sign-in uses Supabase Auth (email + password, Google). Setup steps, the database migration and the
Google OAuth configuration are in [`docs/AUTH.md`](docs/AUTH.md). Without Supabase configured, public pages work and
every private page redirects to a login screen that explains setup is needed.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lucide · Geist

## Brand (MAKVO · Spring palette)
- Name: `src/lib/brand.ts`. Logos: `public/brand/` (from the MAKVO brand kit). Favicon: `src/app/icon.svg`.
- Colour tokens: `src/app/globals.css` (`:root` = light app on Praxeti, `.theme-dark` = marketing site on Midnight).
  Fixed brand colours are also available as Tailwind classes: `midnight`, `praxeti`, `spring`, `mantis`, `forest` (Picture Book Green), `nuit` (Nuit Blanche).
- Rules followed: dark web / light app; primary action is a Spring pill on Midnight and a Midnight pill with Spring text on Praxeti;
  Mantis = open to work; green = hired / success; Nuit Blanche = links / info.
- Gradients (`grad-spring`, `grad-spring-soft`, `grad-midnight`) only travel Spring → Mantis → Green or Midnight → Nuit Blanche.
- The arch-and-spark motif is `src/components/art/Arches.tsx`; the spark icon is `Spark` in `src/components/ui/Badge.tsx`.

## Photography
Profile pictures and banner photos are placeholders from Unsplash (free under the Unsplash License), mapped by name in
`src/data/photos.ts`. Avatars fall back to brand-coloured initials if a photo is missing. Replace with real uploads before launch.

## Where things live
| Path | What |
| --- | --- |
| `src/app/` | Routes (see below) |
| `src/components/ui/` | Design system: Button, Avatar, Badge, Tabs, Modal, Dropdown/Select, Toasts, Counter, Skeleton, Magnetic… |
| `src/components/cards/` | ProjectCard, PersonCard, JobCard, TeamCard |
| `src/components/art/ProjectArt.tsx` | Generative SVG project artwork (no stock images) |
| `src/components/flows/` | ApplyModal (4-step application), HireModal |
| `src/components/shell/` | Top nav, bottom nav (mobile), global search, cursor |
| `src/data/` | Mock data: 15 people, 10 projects, 9 jobs, 5 teams, 10 posts, 6 conversations, workspace |
| `src/lib/store.tsx` | Single client store: connections, saves, applications, interviews, decisions, messages, workspaces |
| `src/lib/search.ts`, `src/lib/match.ts` | Frontend search index and match scoring |
| `tailwind.config.ts`, `src/app/globals.css` | Design tokens (colour, type scale, radius, shadow) |

## Routes
`/` landing · `/discover` · `/work/[id]` case study · `/feed` · `/people` · `/people/[id]` · `/teams` · `/teams/[id]` ·
`/network` · `/opportunities` · `/opportunities/[id]` (+ apply) · `/talent` (client matching) · `/messages` ·
`/interview` (schedule → call → feedback → decision) · `/projects` · `/projects/[id]` (workspace) · `/dashboard` (creator / client) · `/notifications`

## Connecting a real backend later
The seams are already separated:
- **Data:** `src/data/*` → replace with Supabase/Postgres queries; the types in `src/data/types.ts` map to tables.
- **State:** `src/lib/store.tsx` actions (`connect`, `apply`, `send`, `hire`, …) → server actions / API calls.
- **Auth:** the signed-in user is hard-coded to Varun Sharma (creator) / Amelia Brooks (client); switch via the profile menu.
- **Payments:** the workspace Payments tab and Hire modal are mock UI → Stripe.
- **Messaging / video:** `/messages` and `/interview` are visual only → realtime + WebRTC provider.
- **Matching:** `src/lib/match.ts` and `/talent` → embeddings over portfolio content.
