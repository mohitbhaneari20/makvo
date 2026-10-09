"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { TEAMS } from "@/data/teams";
import { TeamCard } from "@/components/cards/TeamCard";
import { SubNav, PEOPLE_NAV } from "@/components/shell/SubNav";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useApp } from "@/lib/store";

export default function Teams() {
  const [open, setOpen] = useState(false);
  const { toast } = useApp();
  const [name, setName] = useState("");
  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div><div className="mb-5"><SubNav items={PEOPLE_NAV} id="people" /></div><h1 className="t-h1 max-w-2xl">Teams that already work well together.</h1><p className="mt-3 max-w-lg text-body text-mute">Designers and developers who ship as one. Hire a whole team with one brief, one rate and one point of contact.</p></div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>Create a team</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{TEAMS.map((t) => <TeamCard key={t.id} team={t} />)}</div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create a team" width="max-w-lg">
        <form className="p-6 md:p-8" onSubmit={(e) => { e.preventDefault(); setOpen(false); toast(`${name || "Your team"} created. Invite your first member`); setName(""); }}>
          <div className="t-caption mb-2">New team</div>
          <h2 className="t-h2">Work together, get hired together.</h2>
          <label className="mt-6 block"><span className="t-caption mb-2 block">Team name</span><input required value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="e.g. Studio North" /></label>
          <label className="mt-4 block"><span className="t-caption mb-2 block">What do you do together?</span><input className="field" placeholder="Design + Development" /></label>
          <p className="mt-4 text-small text-mute">You’ll invite members next. Projects you complete together become verified work on the team page.</p>
          <div className="mt-6 flex justify-end"><Button type="submit">Create team</Button></div>
        </form>
      </Modal>
    </div>
  );
}
