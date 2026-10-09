"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Check, Heart, Loader2, Plus, UserPlus, UserCheck } from "lucide-react";
import { useApp } from "@/lib/store";
import { personById } from "@/data/people";
import { Button } from "./Button";

const stop = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); };

export function LikeButton({ id, count, kind = "project", className = "" }: { id: string; count: number; kind?: "project" | "post"; className?: string }) {
  const { liked, likedPosts, toggleLike, togglePostLike } = useApp();
  const on = (kind === "project" ? liked : likedPosts).includes(id);
  return (
    <button onClick={(e) => { stop(e); (kind === "project" ? toggleLike : togglePostLike)(id); }} aria-pressed={on} aria-label="Like"
      className={`group/like relative inline-flex items-center gap-1.5 text-small transition-colors ${on ? "text-hi" : "text-mute hover:text-ink"} ${className}`}>
      <motion.span key={String(on)} initial={{ scale: on ? 0.6 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}>
        <Heart className={`h-4 w-4 ${on ? "fill-hi" : ""}`} />
      </motion.span>
      <span className="tabular-nums">{(count + (on ? 1 : 0)).toLocaleString()}</span>
    </button>
  );
}

export function SaveButton({ id, kind = "project", overlay, label }: { id: string; kind?: "project" | "job"; overlay?: boolean; label?: boolean }) {
  const { saved, savedJobs, toggleSave, toggleSaveJob, toast } = useApp();
  const on = (kind === "project" ? saved : savedJobs).includes(id);
  return (
    <motion.button whileTap={{ scale: 0.88 }} aria-pressed={on} aria-label={on ? "Remove from saved" : "Save"}
      onClick={(e) => { stop(e); (kind === "project" ? toggleSave : toggleSaveJob)(id); toast(on ? "Removed from saved" : kind === "job" ? "Project saved" : "Saved to your collection"); }}
      className={overlay
        ? `inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface/95 text-ink shadow-soft backdrop-blur transition hover:bg-surface ${on ? "" : "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"}`
        : `inline-flex h-10 items-center justify-center gap-2 rounded-full border border-ink/20 bg-transparent px-4 text-body text-ink transition hover:border-ink`}>
      <motion.span key={String(on)} initial={{ y: on ? -6 : 0, scale: on ? 1.3 : 1 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 450, damping: 14 }}>
        <Bookmark className={`h-4 w-4 ${on ? "fill-ink" : ""}`} />
      </motion.span>
      {label && (on ? "Saved" : "Save")}
    </motion.button>
  );
}

export function ConnectButton({ id, size = "md", variant, full }: { id: string; size?: "sm" | "md" | "lg"; variant?: "outline" | "primary" | "soft"; full?: boolean }) {
  const { conn, connect, disconnect, toast } = useApp();
  const s = conn[id] ?? "none";
  let name = "them"; try { name = personById(id).name.split(" ")[0]; } catch {}
  return (
    <Button size={size} full={full} variant={s === "none" ? (variant ?? "outline") : "soft"}
      onClick={(e) => {
        stop(e);
        if (s === "none") { connect(id); toast(`Request sent to ${name}`); }
        else if (s === "connected") { disconnect(id); toast(`Removed ${name} from your network`); }
      }}
      icon={
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={s} initial={{ opacity: 0, scale: 0.5, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.18 }} className="flex">
            {s === "none" ? <UserPlus className="h-4 w-4" /> : s === "pending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4 text-ok" />}
          </motion.span>
        </AnimatePresence>
      }>
      {s === "none" ? "Connect" : s === "pending" ? "Pending" : "Connected"}
    </Button>
  );
}

export function FollowButton({ id, size = "sm" }: { id: string; size?: "sm" | "md" }) {
  const { following, toggleFollow, toast } = useApp();
  const on = following.includes(id);
  let name = "them"; try { name = personById(id).name.split(" ")[0]; } catch {}
  return (
    <Button size={size} variant={on ? "soft" : "ghost"} icon={on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      onClick={(e) => { stop(e); toggleFollow(id); toast(on ? `Unfollowed ${name}` : `Following ${name}`); }}>
      {on ? "Following" : "Follow"}
    </Button>
  );
}
