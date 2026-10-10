"use client";
import { useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { setProfileImage } from "@/lib/auth/actions";
import { checkImageFile, IMAGE_ACCEPT, removeOldProfileImage, uploadProfileImage, type ImageKind } from "@/lib/auth/upload-image";
import { Avatar } from "@/components/ui/Avatar";
import { FormAlert } from "@/components/auth/FormControls";
import { useApp } from "@/lib/store";

const UPLOAD_ERRORS: Record<string, string> = {
  "Bucket not found": "Image uploads aren't set up yet. Run the profile media migration in Supabase.",
  "new row violates row-level security policy": "You can only change your own images.",
};

/** Upload or remove one image, then save its URL to the profile. */
function useImage(userId: string, kind: ImageKind, current: string | null) {
  const { toast } = useApp();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [preview, setPreview] = useState<string | null | undefined>(undefined); // undefined: show `current`

  const pick = () => input.current?.click();
  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const problem = checkImageFile(file); if (problem) { setError(problem); return; }
    setError(undefined); setBusy(true);
    const local = URL.createObjectURL(file); setPreview(local);
    try {
      const { url } = await uploadProfileImage(userId, file, kind);
      const res = await setProfileImage(kind, url);
      if (!res.ok) throw new Error(res.message);
      await removeOldProfileImage(userId, current);
      setPreview(url);
      toast(kind === "avatar" ? "Profile photo updated" : "Cover image updated", "ok");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setError(UPLOAD_ERRORS[msg] ?? (msg && !msg.includes("fetch") ? msg : "Upload failed. Please try again."));
      setPreview(undefined);
    } finally {
      URL.revokeObjectURL(local); setBusy(false);
      if (input.current) input.current.value = "";
    }
  };
  const remove = async () => {
    setError(undefined); setBusy(true);
    const res = await setProfileImage(kind, null);
    if (res.ok) { await removeOldProfileImage(userId, current); setPreview(null); toast(kind === "avatar" ? "Profile photo removed" : "Cover image removed"); }
    else setError(res.message);
    setBusy(false);
  };
  const shown = preview === undefined ? current : preview;
  const fileInput = <input ref={input} type="file" accept={IMAGE_ACCEPT} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => onFile(e.target.files?.[0])} />;
  return { pick, remove, busy, error, shown, fileInput };
}

function Btn({ onClick, disabled, children, tone = "default" }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; tone?: "default" | "quiet" }) {
  return <button type="button" onClick={onClick} disabled={disabled} className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-small font-medium transition disabled:opacity-50 ${tone === "default" ? "border border-ink/20 hover:border-ink" : "text-mute hover:text-ink"}`}>{children}</button>;
}

export function ProfileImages({ userId, name, avatarUrl, coverUrl }: { userId: string; name: string; avatarUrl: string | null; coverUrl: string | null }) {
  const avatar = useImage(userId, "avatar", avatarUrl);
  const cover = useImage(userId, "cover", coverUrl);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2.5 text-small font-medium text-ink">Cover image</div>
        <div className="relative aspect-[16/5] overflow-hidden rounded-md bg-midnight">
          {cover.shown
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={cover.shown} alt="" className="h-full w-full object-cover" />
            : <div className="absolute inset-0 grid place-items-center text-small text-praxeti/70">No cover image</div>}
          {cover.busy && <div className="absolute inset-0 grid place-items-center bg-midnight/50"><Loader2 className="h-6 w-6 animate-spin text-praxeti" aria-label="Uploading" /></div>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Btn onClick={cover.pick} disabled={cover.busy}><ImagePlus className="h-4 w-4" />{cover.shown ? "Change cover" : "Upload cover"}</Btn>
          {cover.shown && <Btn tone="quiet" onClick={cover.remove} disabled={cover.busy}><Trash2 className="h-4 w-4" />Remove</Btn>}
          <span className="text-[12px] text-mute">Wide image works best, at least 1600 × 500.</span>
        </div>
        {cover.fileInput}
        {cover.error && <div className="mt-3"><FormAlert tone="error">{cover.error}</FormAlert></div>}
      </div>

      <div>
        <div className="mb-2.5 text-small font-medium text-ink">Profile photo</div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="relative flex rounded-full">
            <Avatar name={name} src={avatar.shown} size={72} />
            {avatar.busy && <span className="absolute inset-0 grid place-items-center rounded-full bg-midnight/50"><Loader2 className="h-5 w-5 animate-spin text-praxeti" aria-label="Uploading" /></span>}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Btn onClick={avatar.pick} disabled={avatar.busy}><Camera className="h-4 w-4" />{avatar.shown ? "Change photo" : "Upload photo"}</Btn>
            {avatar.shown && <Btn tone="quiet" onClick={avatar.remove} disabled={avatar.busy}><Trash2 className="h-4 w-4" />Remove</Btn>}
          </div>
        </div>
        <p className="mt-2 text-[12px] text-mute">Square works best. JPG, PNG or WebP, up to 15 MB.</p>
        {avatar.fileInput}
        {avatar.error && <div className="mt-3"><FormAlert tone="error">{avatar.error}</FormAlert></div>}
      </div>
    </div>
  );
}
