import Link from "next/link";

export function LegalPage({ title, intro, points }: { title: string; intro: string; points: { h: string; p: string }[] }) {
  return (
    <div className="container-x max-w-3xl py-12 md:py-20">
      <p className="t-eyebrow">Legal</p>
      <h1 className="t-h1 mt-4">{title}</h1>
      <p className="mt-5 max-w-[60ch] text-body text-mute">{intro}</p>
      <div className="mt-6 rounded-sm border border-nuit/25 bg-nuit/[0.06] p-4 text-small">This is a summary for the MAKVO preview. The full, legally reviewed version will be published here before public launch.</div>
      <dl className="mt-10 divide-y divide-line border-y border-line">
        {points.map((x) => (<div key={x.h} className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-8"><dt className="font-medium">{x.h}</dt><dd className="text-body text-mute">{x.p}</dd></div>))}
      </dl>
      <p className="mt-10 text-small text-mute"><Link href="/signup" className="text-ink underline-link">Create an account</Link> · <Link href="/" className="text-ink underline-link">Back to MAKVO</Link></p>
    </div>
  );
}
