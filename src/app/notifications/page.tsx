"use client";
import Link from "next/link";
import { NOTIFICATIONS } from "@/data/social";

export default function Notifications() {
  return (
    <div className="container-x pt-10 md:pt-16">
      <h1 className="t-h1">Notifications</h1>
      <ul className="mt-8 max-w-2xl border-b border-line">
        {NOTIFICATIONS.map((n) => (
          <li key={n.id}><Link href={n.href} className="flex gap-4 border-t border-line py-5"><span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-hi" : "bg-transparent"}`} /><span className="flex-1"><span className="block text-body font-medium">{n.text}</span><span className="block text-small text-mute">{n.sub}</span></span><span className="text-small text-faint">{n.when}</span></Link></li>
        ))}
      </ul>
    </div>
  );
}
