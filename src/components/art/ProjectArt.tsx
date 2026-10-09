import { useId } from "react";
import type { Project } from "@/data/types";

type P = [string, string, string];
const F = "var(--font-sans), system-ui, sans-serif";

function Fintech({ p, id }: { p: P; id: string }) {
  const [bg, ac, fg] = p;
  const line = "M180 440 C230 420 260 360 320 380 S410 300 470 320 S560 230 620 250 S700 170 770 150";
  return (
    <>
      <rect width="800" height="600" fill={bg} />
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={ac} stopOpacity=".28" /><stop offset="1" stopColor={ac} stopOpacity="0" /></linearGradient>
      </defs>
      <rect width="150" height="600" fill={fg} opacity=".05" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="28" y={90 + i * 44} width={i === 0 ? 92 : 70 + (i % 3) * 8} height="10" rx="2" fill={fg} opacity={i === 0 ? 0.9 : 0.22} />)}
      <circle cx="40" cy="44" r="12" fill={ac} />
      <text x="190" y="82" fill={fg} opacity=".5" fontSize="15" fontFamily={F}>Total balance · All accounts</text>
      <text x="188" y="168" fill={fg} fontSize="86" fontWeight="500" letterSpacing="-4" fontFamily={F}>$248,310</text>
      <rect x="560" y="116" width="104" height="30" rx="4" fill={ac} />
      <text x="578" y="136" fill={bg} fontSize="14" fontWeight="600" fontFamily={F}>+12.4% MoM</text>
      <path d={`${line} L770 560 L180 560 Z`} fill={`url(#${id}a)`} />
      <path d={line} stroke={ac} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="620" cy="250" r="7" fill={ac} /><circle cx="620" cy="250" r="16" fill={ac} opacity=".2" />
      {[[190, "Runway", "19 mo"], [340, "Burn", "$13.1K"], [490, "Pending", "6 invoices"]].map(([x, a, b]) => (
        <g key={a as string}><rect x={x as number} y="230" width="132" height="62" rx="6" fill={fg} opacity=".06" />
          <text x={(x as number) + 14} y="254" fill={fg} opacity=".5" fontSize="12" fontFamily={F}>{a}</text>
          <text x={(x as number) + 14} y="278" fill={fg} fontSize="20" fontWeight="500" fontFamily={F}>{b}</text></g>
      ))}
    </>
  );
}

function Fashion({ p }: { p: P }) {
  const [bg, cream, dark] = p;
  return (
    <>
      <rect width="800" height="600" fill={bg} />
      <path d="M470 600 V300 A130 130 0 0 1 730 300 V600 Z" fill={cream} />
      <circle cx="600" cy="262" r="46" fill={bg} opacity=".9" />
      <rect x="470" y="480" width="260" height="120" fill={dark} opacity=".12" />
      <text x="-6" y="470" fill={dark} fontSize="300" fontWeight="500" letterSpacing="-16" fontFamily={F}>Noma</text>
      <text x="48" y="64" fill={cream} fontSize="13" letterSpacing="3" fontFamily={F} fontWeight="500">SS—26 · LINEN COLLECTION</text>
      <text x="48" y="552" fill={cream} fontSize="13" letterSpacing="3" fontFamily={F} fontWeight="500">SLOW CLOTHES, MADE TO KEEP</text>
      <line x1="48" y1="84" x2="180" y2="84" stroke={cream} strokeWidth="1" />
    </>
  );
}

function AI({ p, id }: { p: P; id: string }) {
  const [bg, ac, fg] = p;
  return (
    <>
      <rect width="800" height="600" fill={bg} />
      <defs>
        <radialGradient id={`${id}g`}><stop offset="0" stopColor={ac} stopOpacity=".95" /><stop offset=".45" stopColor={ac} stopOpacity=".25" /><stop offset="1" stopColor={ac} stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="400" cy="270" r="210" fill={`url(#${id}g)`} />
      {[70, 120, 175, 235, 300].map((r, i) => <ellipse key={r} cx="400" cy="270" rx={r * 1.5} ry={r * 0.62} fill="none" stroke={fg} strokeOpacity={0.5 - i * 0.08} strokeWidth="1" transform={`rotate(${-18 + i * 4} 400 270)`} />)}
      {[[250, 215], [560, 340], [330, 360], [640, 210], [480, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 2 ? 5 : 8} fill={fg} opacity={i % 2 ? 0.55 : 0.95} />)}
      <circle cx="400" cy="270" r="30" fill={fg} />
      <rect x="170" y="486" width="460" height="56" rx="10" fill={fg} opacity=".08" stroke={fg} strokeOpacity=".2" />
      <text x="196" y="520" fill={fg} opacity=".7" fontSize="17" fontFamily={F}>Summarise last week’s research and draft the spec…</text>
      <rect x="548" y="498" width="68" height="32" rx="6" fill={ac} />
      <text x="565" y="520" fill={bg} fontSize="14" fontWeight="600" fontFamily={F}>Run ⏎</text>
      <text x="48" y="58" fill={fg} fontSize="18" fontWeight="500" fontFamily={F}>Orbit</text>
      <rect x="640" y="36" width="112" height="28" rx="14" fill={fg} opacity=".08" />
      <text x="660" y="55" fill={fg} opacity=".8" fontSize="12" fontFamily={F}>3 sources cited</text>
    </>
  );
}

function Portfolio({ p }: { p: P }) {
  const [bg, ink, ac] = p;
  return (
    <>
      <rect width="800" height="600" fill={bg} />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={200 * i} y1="0" x2={200 * i} y2="600" stroke={ink} strokeOpacity=".12" />)}
      <line x1="0" y1="110" x2="800" y2="110" stroke={ink} strokeOpacity=".5" />
      <text x="32" y="78" fill={ink} fontSize="18" fontWeight="600" fontFamily={F}>Bellini Architects</text>
      <text x="520" y="78" fill={ink} fontSize="14" fontFamily={F}>Index (24)   Studio   Contact</text>
      <text x="22" y="372" fill={ink} fontSize="196" fontWeight="600" letterSpacing="-12" fontFamily={F}>Mono</text>
      <rect x="500" y="140" width="268" height="196" fill={ink} />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={516 + i * 27} y="160" width="12" height={60 + ((i * 37) % 90)} fill={bg} opacity={0.9 - (i % 3) * 0.2} />)}
      <circle cx="740" cy="168" r="9" fill={ac} />
      {[["01", "Casa Verde", "Lisbon"], ["02", "Torre Norte", "Milan"], ["03", "Void House", "Ticino"], ["04", "Salt Pavilion", "Puglia"]].map(([n, t, c], i) => (
        <g key={n}><text x="32" y={444 + i * 34} fill={ink} fontSize="15" opacity=".5" fontFamily={F}>{n}</text>
          <text x="80" y={444 + i * 34} fill={ink} fontSize="15" fontWeight="500" fontFamily={F}>{t}</text>
          <text x="300" y={444 + i * 34} fill={ink} fontSize="15" opacity=".5" fontFamily={F}>{c}</text>
          <line x1="32" x2="380" y1={452 + i * 34} y2={452 + i * 34} stroke={ink} strokeOpacity=".15" /></g>
      ))}
      <rect x="500" y="360" width="268" height="196" fill={ac} />
      <path d="M500 556 L634 396 L768 556 Z" fill={bg} opacity=".95" />
    </>
  );
}

function Phone({ x, y, rot, bg, fg, ac, variant }: { x: number; y: number; rot: number; bg: string; fg: string; ac: string; variant: 0 | 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect width="250" height="510" rx="38" fill="#0B0F1E" />
      <rect x="8" y="8" width="234" height="494" rx="31" fill={variant ? "#F5F7FF" : bg} />
      <rect x="86" y="18" width="78" height="22" rx="11" fill="#0B0F1E" />
      {variant === 0 ? (
        <>
          <text x="26" y="92" fill={fg} opacity=".6" fontSize="13" fontFamily={F}>Good morning, Aanya</text>
          <text x="24" y="148" fill={fg} fontSize="46" fontWeight="500" letterSpacing="-2" fontFamily={F}>$4,820</text>
          <rect x="24" y="176" width="202" height="116" rx="16" fill={ac} />
          <circle cx="188" cy="214" r="14" fill="#fff" opacity=".9" /><circle cx="204" cy="214" r="14" fill="#fff" opacity=".5" />
          <text x="40" y="270" fill="#fff" fontSize="13" fontFamily={F}>•••• 2931</text>
          {[0, 1, 2].map((i) => (<g key={i}><circle cx="38" cy={334 + i * 50} r="14" fill={fg} opacity=".12" /><rect x="64" y={324 + i * 50} width={90 - i * 10} height="9" rx="3" fill={fg} opacity=".7" /><rect x="64" y={340 + i * 50} width="56" height="7" rx="3" fill={fg} opacity=".25" /><rect x="178" y={329 + i * 50} width="44" height="10" rx="3" fill={fg} opacity=".5" /></g>))}
        </>
      ) : (
        <>
          <text x="26" y="96" fill="#0B1233" fontSize="26" fontWeight="500" letterSpacing="-1" fontFamily={F}>What’s your</text>
          <text x="26" y="126" fill="#0B1233" fontSize="26" fontWeight="500" letterSpacing="-1" fontFamily={F}>legal name?</text>
          <rect x="26" y="162" width="198" height="52" rx="12" fill="#fff" stroke="#C9D2F5" />
          <text x="42" y="194" fill="#0B1233" fontSize="16" fontFamily={F}>Aanya Verma</text>
          <rect x="26" y="238" width="198" height="4" rx="2" fill="#DDE4FF" /><rect x="26" y="238" width="80" height="4" rx="2" fill={ac} />
          <text x="26" y="276" fill="#6C7499" fontSize="12" fontFamily={F}>Step 2 of 5 · About 90 seconds</text>
          <rect x="26" y="430" width="198" height="52" rx="26" fill={ac} />
          <text x="102" y="462" fill="#fff" fontSize="16" fontWeight="600" fontFamily={F}>Continue</text>
        </>
      )}
    </g>
  );
}
function Mobile({ p }: { p: P }) {
  const [bg, light, ink] = p;
  return (
    <>
      <rect width="800" height="600" fill={bg} />
      <circle cx="680" cy="120" r="220" fill="#fff" opacity=".07" />
      <Phone x={170} y={110} rot={-6} bg={light} fg={ink} ac={bg} variant={1} />
      <Phone x={410} y={50} rot={5} bg={light} fg={ink} ac={bg} variant={0} />
      <text x="40" y="560" fill="#fff" opacity=".85" fontSize="14" letterSpacing="3" fontFamily={F} fontWeight="500">ARC · BANKING FOR HUMANS</text>
    </>
  );
}

function Commerce({ p }: { p: P }) {
  const [bg, ac, ink] = p;
  return (
    <>
      <rect width="800" height="600" fill={bg} />
      <text x="40" y="66" fill={ink} fontSize="24" fontWeight="600" letterSpacing="-1" fontFamily={F}>forma</text>
      <text x="460" y="64" fill={ink} fontSize="14" fontFamily={F}>Seating   Tables   Light   Objects</text>
      {[[40, "Arc Chair", "$640"], [290, "Pillar Vase", "$120"], [540, "Disc Table", "$980"]].map(([x, n, pr], i) => (
        <g key={n as string}>
          <rect x={x as number} y="100" width="220" height="400" fill={i === 1 ? "#D8C7AD" : i === 2 ? "#F4ECDD" : "#EFE4D0"} />
          {i === 0 && <><path d={`M${(x as number) + 50} 430 V300 A60 60 0 0 1 ${(x as number) + 170} 300 V430 Z`} fill={ac} /><rect x={(x as number) + 50} y="420" width="120" height="14" fill={ink} /></>}
          {i === 1 && <><rect x={(x as number) + 78} y="230" width="64" height="200" rx="8" fill={ink} /><ellipse cx={(x as number) + 110} cy="230" rx="32" ry="9" fill="#3A342C" /></>}
          {i === 2 && <><ellipse cx={(x as number) + 110} cy="320" rx="86" ry="22" fill={ac} /><rect x={(x as number) + 104} y="320" width="12" height="108" fill={ink} /><ellipse cx={(x as number) + 110} cy="432" rx="52" ry="9" fill={ink} /></>}
          <text x={x as number} y="534" fill={ink} fontSize="16" fontWeight="500" fontFamily={F}>{n}</text>
          <text x={(x as number) + 220} y="534" textAnchor="end" fill={ink} fontSize="16" opacity=".6" fontFamily={F}>{pr}</text>
        </g>
      ))}
      <rect x="40" y="556" width="190" height="2" fill={ink} opacity=".2" />
    </>
  );
}

function Brand({ p }: { p: P }) {
  const [bg, ink, ac] = p;
  return (
    <>
      <rect width="800" height="600" fill={bg} />
      <circle cx="260" cy="270" r="170" fill={ink} />
      <circle cx="260" cy="270" r="150" fill="none" stroke={bg} strokeWidth="2" strokeDasharray="2 7" />
      <text x="260" y="262" textAnchor="middle" fill={bg} fontSize="86" fontWeight="500" letterSpacing="-4" fontFamily={F}>K&amp;Co</text>
      <text x="260" y="318" textAnchor="middle" fill={ac} fontSize="22" letterSpacing="8" fontFamily={F} fontWeight="500">No. 07</text>
      <rect x="480" y="90" width="270" height="210" fill={ac} />
      <rect x="500" y="110" width="230" height="170" fill="none" stroke={bg} strokeWidth="2" />
      <text x="615" y="218" textAnchor="middle" fill={bg} fontSize="46" fontWeight="500" letterSpacing="-2" fontFamily={F}>Kiln</text>
      {[ink, ac, "#F3EBDD", "#8FA09A"].map((c, i) => <rect key={c} x={480 + i * 70} y="330" width="62" height="62" fill={c} stroke={ink} strokeOpacity=".15" />)}
      <rect x="480" y="430" width="270" height="120" fill={bg} stroke={ink} strokeWidth="2" />
      <text x="500" y="474" fill={ink} fontSize="22" fontWeight="500" fontFamily={F}>Glaze 14 — Ember</text>
      <text x="500" y="506" fill={ink} opacity=".6" fontSize="14" fontFamily={F}>Thrown, fired and numbered by hand.</text>
      <path d="M60 480 h340 v70 h-340 z" fill="none" stroke={ink} strokeWidth="2" />
      <text x="80" y="523" fill={ink} fontSize="15" letterSpacing="4" fontWeight="500" fontFamily={F}>CERAMICS · LISBON</text>
    </>
  );
}

function Three({ p, id }: { p: P; id: string }) {
  const [bg, amber, cream] = p;
  return (
    <>
      <rect width="800" height="600" fill={bg} />
      <defs>
        <radialGradient id={`${id}s`} cx=".38" cy=".32"><stop offset="0" stopColor="#FFF4DA" /><stop offset=".35" stopColor={amber} /><stop offset="1" stopColor="#A84F12" /></radialGradient>
        <radialGradient id={`${id}h`}><stop offset="0" stopColor={amber} stopOpacity=".55" /><stop offset="1" stopColor={amber} stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={amber} stopOpacity=".42" /><stop offset="1" stopColor={amber} stopOpacity="0" /></linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4A433B" /><stop offset="1" stopColor="#1B1815" /></linearGradient>
      </defs>
      <circle cx="400" cy="270" r="340" fill={`url(#${id}h)`} />
      <path d="M330 300 L190 600 H610 L470 300 Z" fill={`url(#${id}c)`} />
      <ellipse cx="400" cy="548" rx="190" ry="26" fill="#000" opacity=".45" />
      <rect x="388" y="372" width="24" height="168" rx="6" fill={`url(#${id}b)`} />
      <ellipse cx="400" cy="548" rx="86" ry="14" fill={`url(#${id}b)`} />
      <circle cx="400" cy="270" r="104" fill={`url(#${id}s)`} />
      <path d="M312 300 A104 104 0 0 0 488 300" fill="none" stroke="#000" strokeOpacity=".15" strokeWidth="2" />
      <text x="400" y="64" textAnchor="middle" fill={cream} fontSize="14" letterSpacing="4" fontWeight="500" fontFamily={F}>LUMEN — FOLLOWS THE SUN</text>
      <text x="400" y="560" textAnchor="middle" fill={cream} opacity=".6" fontSize="14" fontFamily={F}>00:00 ——————○—————— 00:45</text>
    </>
  );
}

function Docs({ p }: { p: P }) {
  const [bg, ac, fg] = p;
  const cols = [ac, "#F78166", "#7EE787", "#D2A8FF", fg];
  return (
    <>
      <rect width="800" height="600" fill={bg} />
      <rect x="0" y="0" width="800" height="54" fill={fg} opacity=".05" />
      <text x="32" y="34" fill={fg} fontSize="16" fontWeight="600" fontFamily={F}>atlas / docs</text>
      <rect x="470" y="14" width="300" height="28" rx="6" fill={fg} opacity=".08" />
      <text x="486" y="33" fill={fg} opacity=".55" fontSize="13" fontFamily={F}>Search the docs</text><text x="728" y="33" fill={fg} opacity=".55" fontSize="12" fontFamily={F}>⌘K</text>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x="32" y={96 + i * 34} width={i === 1 ? 108 : 80 + (i % 3) * 14} height="10" rx="2" fill={i === 1 ? ac : fg} opacity={i === 1 ? 1 : 0.28} />)}
      <text x="230" y="130" fill={fg} fontSize="40" fontWeight="600" letterSpacing="-1.5" fontFamily={F}>Authentication</text>
      <rect x="230" y="150" width="440" height="9" rx="3" fill={fg} opacity=".3" /><rect x="230" y="168" width="360" height="9" rx="3" fill={fg} opacity=".3" />
      <rect x="230" y="210" width="520" height="290" rx="10" fill="#000" opacity=".35" stroke={fg} strokeOpacity=".12" />
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}><text x="248" y={244 + i * 24} fill={fg} opacity=".25" fontSize="13" fontFamily="var(--font-mono), monospace">{i + 1}</text>
          <rect x="278" y={234 + i * 24} width={30 + ((i * 53) % 60)} height="9" rx="2" fill={cols[i % 5]} opacity=".9" />
          <rect x={278 + 40 + ((i * 53) % 60)} y={234 + i * 24} width={50 + ((i * 37) % 120)} height="9" rx="2" fill={cols[(i + 2) % 5]} opacity=".55" /></g>
      ))}
      <rect x="560" y="520" width="190" height="40" rx="8" fill={ac} />
      <text x="606" y="546" fill={bg} fontSize="14" fontWeight="600" fontFamily={F}>Run example ▸</text>
    </>
  );
}

function Learn({ p }: { p: P }) {
  const [bg, green, cream] = p;
  return (
    <>
      <rect width="800" height="600" fill={bg} />
      <circle cx="130" cy="520" r="190" fill={green} opacity=".12" />
      <circle cx="700" cy="90" r="120" fill={cream} opacity=".6" />
      <rect x="64" y="70" width="410" height="460" rx="28" fill={cream} />
      <text x="96" y="130" fill={green} fontSize="16" letterSpacing="2" fontWeight="600" fontFamily={F}>TODAY’S CLUB</text>
      <text x="96" y="200" fill="#1B2E28" fontSize="52" fontWeight="600" letterSpacing="-2" fontFamily={F}>Build a</text>
      <text x="96" y="256" fill="#1B2E28" fontSize="52" fontWeight="600" letterSpacing="-2" fontFamily={F}>paper bridge</text>
      {[["Planning", 100], ["Building", 64], ["Testing", 12]].map(([l, v], i) => (
        <g key={l as string}><text x="96" y={332 + i * 54} fill="#1B2E28" fontSize="15" fontWeight="500" fontFamily={F}>{l}</text>
          <rect x="96" y={344 + i * 54} width="340" height="12" rx="6" fill={green} opacity=".16" /><rect x="96" y={344 + i * 54} width={3.4 * (v as number)} height="12" rx="6" fill={green} /></g>
      ))}
      <rect x="520" y="200" width="220" height="150" rx="24" fill={green} /><circle cx="570" cy="258" r="22" fill={bg} /><circle cx="620" cy="258" r="22" fill={cream} /><circle cx="670" cy="258" r="22" fill={bg} opacity=".6" />
      <text x="548" y="320" fill={cream} fontSize="18" fontWeight="600" fontFamily={F}>12 learners today</text>
      <rect x="520" y="380" width="220" height="150" rx="24" fill="#fff" opacity=".7" />
      <path d="M545 490 Q 580 420 630 470 T 715 430" fill="none" stroke={green} strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

export function ProjectArt({ art, palette, className = "" }: { art: Project["art"]; palette: Project["palette"]; className?: string }) {
  const id = useId().replace(/:/g, "");
  const body = {
    fintech: <Fintech p={palette} id={id} />, fashion: <Fashion p={palette} />, ai: <AI p={palette} id={id} />, portfolio: <Portfolio p={palette} />,
    mobile: <Mobile p={palette} />, commerce: <Commerce p={palette} />, brand: <Brand p={palette} />, three: <Three p={palette} id={id} />, docs: <Docs p={palette} />, learn: <Learn p={palette} />,
  }[art];
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className={`block h-full w-full ${className}`} role="img" aria-hidden="true">{body}</svg>
  );
}
